const base = process.env.PAYPAL_API_URL || "https://api-m.sandbox.paypal.com";

export const paypal = {
  createOrder: async function createOrder(price: number) {
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: price.toFixed(2),
            },
          },
        ],
      }),
    });

    const data = await handleResponse(response);
    // return the full response object so callers can inspect id, status, and other metadata
    return data;
  },

  capturePayment: async function capturePayment(orderId: string) {
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders/${orderId}/capture`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    const data = await handleResponse(response);
    return data;
  },
};

// Generate paypal token
export async function generateAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${auth}`,
    },
    body: "grant_type=client_credentials",
  });

  const data = await handleResponse(response);
  return data.access_token;
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`PayPal API request failed: ${errorData}`);
  }
  return response.json();
}
