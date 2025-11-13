export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "BuyMe";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  "Your one-stop shop for everything!";
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
export const LATEST_PRODUCTS_LIMIT =
  Number(process.env.NEXT_PUBLIC_LATEST_PRODUCTS_LIMIT) || 4;

export const signInDefaultValues = {
  email: "",
  password: "",
};
export const signUpDefaultValues = {
  email: "",
  password: "",
  name: "",
  confirmPassword: "",
};

export const shippingAddressDefaultValues = {
  fullName: " ",
  address: " ",
  city: " ",
  postalCode: " ",
  country: " ",
  phone: " ",
};

export const PAYMENT_METHODS = process.env.NEXT_PUBLIC_PAYMENT_METHODS
  ? process.env.NEXT_PUBLIC_PAYMENT_METHODS.split(",").map((method) =>
      method.trim()
    )
  : ["PayPal", "Stripe", "Cash on Delivery"];

export const DEFAULT_PAYMENT_METHOD =
  process.env.NEXT_PUBLIC_DEFAULT_PAYMENT_METHOD ??
  process.env.DEFAULT_PAYMENT_METHOD ??
  "PayPal";

export const ORDER_ITEMS_PER_PAGE =
  Number(process.env.NEXT_PUBLIC_ORDER_ITEMS_PER_PAGE) || 12;
