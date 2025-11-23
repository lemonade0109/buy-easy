// Run this to check if cart productIds match actual products
import { prisma } from "@/db/prisma";
import { CartItem } from "@/types";

async function verifyCartProducts() {
  try {
    const carts = await prisma.cart.findMany({
      select: { id: true, items: true, userId: true },
    });

    console.log(`Found ${carts.length} carts`);

    for (const cart of carts) {
      const items = cart.items as CartItem[];
      console.log(`\nCart ${cart.id} (User: ${cart.userId || "Guest"}):`);
      console.log(`  Items: ${items.length}`);

      for (const item of items) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          console.log(`  ❌ INVALID: ${item.name} (ID: ${item.productId})`);
          console.log(`     This product no longer exists!`);
        } else {
          console.log(`  ✅ Valid: ${item.name}`);
        }
      }
    }

    // Also show all valid product IDs
    const products = await prisma.product.findMany({
      select: { id: true, name: true },
    });

    console.log(`\n\nValid Product IDs in database:`);
    products.forEach((p) => {
      console.log(`  ${p.id} - ${p.name}`);
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyCartProducts();
