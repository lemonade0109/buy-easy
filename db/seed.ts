import { withAccelerate } from "@prisma/extension-accelerate";
import sampleData from "./sample-data";
import { PrismaClient } from "@prisma/client";

async function main() {
  const prisma = new PrismaClient().$extends(withAccelerate());
  await prisma.product.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  await prisma.verificationToken.deleteMany();

  await prisma.product.createMany({
    data: sampleData.products,
  });
  await prisma.user.createMany({
    data: sampleData.users,
  });

  console.log("Database has been seeded. 🌱");
}

main();
