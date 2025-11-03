"use server";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import {
  convertToPlainObject,
  renderError,
  roundToTwoDecimalPlaces,
} from "@/lib/utils";
import {
  cartItemSchema,
  insertCartSchema,
  validateWithZodSchema,
} from "@/lib/validator";
import { CartItem } from "@/types";
import { Prisma } from "@prisma/client";
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
      throw new Error("Product not found");
    }

    if (!cartItems) {
      //No existing cart, create new cart
      const newCartItems = insertCartSchema.parse({
        sessionCartId: sessionCartId,
        userId: userId,
        items: [validatedItem],
        ...calcPrices([validatedItem]),
      });

      // Add to db
      await prisma.cart.create({
        data: newCartItems,
      });

      // Revalidate product page
      revalidatePath(`/product/${product.slug}`);
      return {
        success: true,
        message: `${product.name} added to cart`,
      };
    } else {
      // Check If Item Is Already In Cart
      const existingItem = (cartItems.items as CartItem[]).find(
        (x) => x.productId === validatedItem.productId
      );

      if (existingItem) {
        // Check stock
        if (product.stockCount < existingItem.quantity + 1) {
          throw new Error("Not enough stock");
        }

        // Increase the quantity
        (cartItems.items as CartItem[]).find(
          (x) => x.productId === validatedItem.productId
        )!.quantity = existingItem.quantity + 1;
      } else {
        // If Items Does Not Exist In Cart
        //Check stock
        if (product.stockCount < 1) throw new Error("Not enough stock");

        //Add new item to cart
        (cartItems.items as CartItem[]).push(validatedItem);
      }

      //Save to DB
      await prisma.cart.update({
        where: { id: cartItems.id },
        data: {
          items: cartItems.items as Prisma.CartUpdateitemsInput[],
          ...calcPrices(cartItems.items as CartItem[]),
        },
      });

      // Revalidate product page
      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} ${
          existingItem ? "updated in" : "added to"
        } cart`,
      };
    }
  } catch (error) {
    return {
      success: false,
      ...renderError(error),
    };
  }
}

export async function getCartItems() {
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
}

export async function removeFromCart(productId: string) {
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
        items: cartItems.items as Prisma.CartUpdateitemsInput[],
        ...calcPrices(cartItems.items as CartItem[]),
      },
    });

    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: `${product.name} was removed from cart`,
    };
  } catch (error) {
    return {
      success: false,
      ...renderError(error),
    };
  }
}
