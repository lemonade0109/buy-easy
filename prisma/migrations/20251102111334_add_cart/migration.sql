-- CreateTable
CREATE TABLE "public"."carts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "sessionCartId" TEXT NOT NULL,
    "userId" UUID,
    "items" JSON[] DEFAULT ARRAY[]::JSON[],
    "itemsPrice" DECIMAL(12,2) NOT NULL,
    "taxPrice" DECIMAL(12,2) NOT NULL,
    "shippingPrice" DECIMAL(12,2) NOT NULL,
    "totalPrice" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "carts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."carts" ADD CONSTRAINT "carts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
