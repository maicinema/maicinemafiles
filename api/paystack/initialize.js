export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({ message: "Paystack initialize API working" });
  }

  try {
    const {
      email,
      amount,
      type,
      metadata = {}
    } = req.body || {};

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ error: "Valid amount is required" });
    }

    if (!type) {
      return res.status(400).json({ error: "Payment type is required" });
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    const appUrl = process.env.VITE_APP_URL || process.env.APP_URL;

    if (!secretKey) {
      return res.status(500).json({
        error: "Paystack secret key is missing. Add PAYSTACK_SECRET_KEY to environment variables."
      });
    }

    if (!appUrl) {
      return res.status(500).json({
        error: "App URL is missing. Add VITE_APP_URL or APP_URL to environment variables."
      });
    }

    const successUrl = `${appUrl}/payment-success?type=${encodeURIComponent(type)}&status=success`;
    const cancelUrl = `${appUrl}/payment-cancel`;

    const reference =
      `${type}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

    const paystackPayload = {
      email,
      amount: Math.round(Number(amount) * 100),
      reference,
      callback_url: successUrl,
      metadata: {
        payment_type: type,
        cancel_action: cancelUrl,
        ...metadata
      }
    };

    const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(paystackPayload)
    });

    const paystackData = await paystackRes.json();

    if (!paystackRes.ok || !paystackData.status) {
      return res.status(500).json({
        error: paystackData.message || "Failed to initialize Paystack payment",
        details: paystackData
      });
    }

    return res.status(200).json({
      status: true,
      message: "Payment initialized",
      reference,
      payment_url: paystackData.data.authorization_url,
      access_code: paystackData.data.access_code,
      raw: paystackData.data
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Unexpected server error"
    });
  }
}