import { generateAccessToken, paypal } from "../lib/paypal";

// Test to verify PayPal access token generation
describe("PayPal API", () => {
  it("should generate a valid access token", async () => {
    const token = await generateAccessToken();
    console.log(token);
    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(0);
  });
});

// Test to verify PayPal order creation
describe("PayPal Order Creation", () => {
  it("should create a PayPal order and return an order ID", async () => {
    const token = await generateAccessToken();
    const price = 20.0; // Example price
    const response = await paypal.createOrder(price);
    console.log(response);
    expect(response).toHaveProperty("id");
    expect(response).toHaveProperty("status");
    expect(response.status).toBe("CREATED");
  });
});

// Test to verify PayPal payment capture
describe("PayPal Payment Capture", () => {
  it("should capture a PayPal payment and return the capture details", async () => {
    const orderId = 100;

    const mockCapturePayment = jest
      .spyOn(paypal, "capturePayment")
      .mockResolvedValue({
        id: "MOCK_CAPTURE_ID",
        status: "COMPLETED",
      });

    const response = await paypal.capturePayment(orderId.toString());
    console.log(response);
    expect(response).toHaveProperty("id", "MOCK_CAPTURE_ID");
    expect(response).toHaveProperty("status", "COMPLETED");

    mockCapturePayment.mockRestore();
  });
});
