"use server";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { convertToPlainObject, roundToTwoDecimalPlaces } from "@/lib/utils";
import {
  cartItemSchema,
  insertCartSchema,
  validateWithZodSchema,
} from "@/lib/validator";
import { CartItem } from "@/types";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

//Calculate Cart prices
const calcPrices = (items: CartItem[]) => {
  const itemsPrice = roundToTwoDecimalPlaces(
      items.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0)
    ),
    shippingPrice = roundToTwoDecimalPlaces(itemsPrice > 100 ? 0 : 10),
    taxPrice = roundToTwoDecimalPlaces(0.15 * itemsPrice),
    totalPrice = roundToTwoDecimalPlaces(itemsPrice + shippingPrice + taxPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export async function addToCart(data: CartItem) {
  try {
    //Check for cart cookie
    const sessionCartId = (await cookies()).get("session_cartId")?.value;
    if (!sessionCartId) {
      throw new Error("No session cart ID found");
    }
    //Get existing cart items from cookie
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    //Get Cart Items
    const cartItems = await getCartItems();

    //Parse and validate Item
    const validatedItem = validateWithZodSchema(cartItemSchema, data);

    //Find product in database
    const product = await prisma.product.findFirst({
      where: { id: validatedItem.productId },
    });

    if (!product) {
      return { success: false, message: "Product not found" };
    }

    if (product.stockCount < 1) {
      return { success: false, message: "Not enough stock available" };
    }

    if (!cartItems) {
      //No existing cart, create new cart
      const newCartItems = insertCartSchema.parse({
        sessionCartId: sessionCartId,
        userId: userId || null,
        items: [validatedItem],
        ...calcPrices([validatedItem]),
      });

      // Add to db
      await prisma.cart.create({
        data: newCartItems,
      });

      revalidatePath(`/product/${product.slug}`);
      return {
        success: true,
        message: `${product.name} added to cart`,
      };
    }

    const items = cartItems.items as CartItem[];
    const existingItem = items.find(
      (item) => item.productId === validatedItem.productId
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + validatedItem.quantity;
      if (newQuantity > product.stockCount) {
        return {
          success: false,
          message: `Only ${product.stockCount} left in stock for ${product.name}`,
        };
      }

      existingItem.quantity = newQuantity;
    } else {
      items.push(validatedItem);
    }
    //Save to DB
    await prisma.cart.update({
      where: { id: cartItems.id },
      data: {
        items: cartItems.items,
        ...calcPrices(cartItems.items as CartItem[]),
      },
    });

    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: `${product.name} ${
        existingItem ? "has been updated in" : "has been added to"
      } cart`,
    };
  } catch (error) {
    console.error("[Cart Error - addToCart]:", error);

    if (
      error instanceof Error &&
      error.message === "No session cart ID found"
    ) {
      return {
        success: false,
        message:
          "Cart session not found. Please refresh the page and try again.",
      };
    }

    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

export const getCartItems = async () => {
  //Check for cart cookie
  const sessionCartId = (await cookies()).get("session_cartId")?.value;
  if (!sessionCartId) {
    throw new Error("No session cart ID found");
  }
  //Get existing cart items from cookie
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  //Get user cart items from database
  const cartItems = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });

  if (!cartItems) return undefined;

  return convertToPlainObject({
    ...cartItems,
    items: cartItems.items as CartItem[],
    itemsPrice: cartItems.itemsPrice.toString(),
    totalPrice: cartItems.totalPrice.toString(),
    taxPrice: cartItems.taxPrice.toString(),
    shippingPrice: cartItems.shippingPrice.toString(),
  });
};

export const removeFromCart = async (productId: string) => {
  try {
    // Check for cart cookie
    const sessionCartId = (await cookies()).get("session_cartId")?.value;
    if (!sessionCartId) throw new Error("No session cart ID found");

    // Get Product
    const product = await prisma.product.findFirst({
      where: { id: productId },
    });
    if (!product) throw new Error("Product not found");

    // Get user cart
    const cartItems = await getCartItems();
    if (!cartItems) throw new Error("No cart found");

    // Check for item
    const existingItem = (cartItems.items as CartItem[]).find(
      (x) => x.productId === productId
    );
    if (!existingItem) throw new Error("Item not found in cart");

    // Check if it's the only in qty
    if (existingItem.quantity === 1) {
      // Remove from cart
      cartItems.items = (cartItems.items as CartItem[]).filter(
        (x) => x.productId !== existingItem.productId
      );
    } else {
      // Decrease quantity
      (cartItems.items as CartItem[]).find(
        (x) => x.productId === existingItem.productId
      )!.quantity = existingItem.quantity - 1;
    }

    // Update cart in DB
    await prisma.cart.update({
      where: { id: cartItems.id },
      data: {
        // items is stored as JSON[] in the database - pass plain JS array
        items: cartItems.items,
        ...calcPrices(cartItems.items as CartItem[]),
      },
    });

    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: `${product.name} was removed from cart`,
    };
  } catch (error) {
    // Log the actual error for debugging
    console.error("[Cart Error - removeFromCart]:", error);

    // Return user-friendly messages for known errors
    if (error instanceof Error) {
      if (error.message === "Product not found") {
        return { success: false, message: "Product not found" };
      }
      if (error.message === "Item not found in cart") {
        return { success: false, message: "Item not found in cart" };
      }
    }

    // Generic message for unexpected errors
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
};
