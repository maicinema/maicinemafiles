export default async function handler(req, res) {
  // Allow browser GET test
  if (req.method !== "POST") {
    return res.status(200).json({ message: "API working" });
  }

  try {
    const { amount } = req.body;

    const base =
      process.env.PAYPAL_ENV === "sandbox"
        ? "https://api-m.sandbox.paypal.com"
        : "https://api-m.paypal.com";

    // Get access token
    const auth = await fetch(`${base}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(
            `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
          ).toString("base64"),
      },
      body: "grant_type=client_credentials",
    });

    const authData = await auth.json();
    const accessToken = authData.access_token;

    // Create order WITH redirect URLs
    const orderRes = await fetch(`${base}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: amount || "10.00",
            },
          },
        ],
        application_context: {
          return_url: `${process.env.VITE_APP_URL}/payment-success`,
          cancel_url: `${process.env.VITE_APP_URL}/payment-cancel`,
          user_action: "PAY_NOW",
        },
      }),
    });

    const orderData = await orderRes.json();

    res.status(200).json(orderData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}