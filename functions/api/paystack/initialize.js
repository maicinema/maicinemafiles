export async function onRequestGet() {
  return new Response(
    JSON.stringify({ message: "Paystack initialize API working" }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const {
      email,
      amount,
      type,
      metadata = {}
    } = body || {};

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    if (!amount || Number(amount) <= 0) {
      return new Response(
        JSON.stringify({ error: "Valid amount is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    if (!type) {
      return new Response(
        JSON.stringify({ error: "Payment type is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const secretKey = context.env.PAYSTACK_SECRET_KEY;
    const appUrl = context.env.VITE_APP_URL || context.env.APP_URL;

    if (!secretKey) {
      return new Response(
        JSON.stringify({
          error: "Paystack secret key is missing. Add PAYSTACK_SECRET_KEY to environment variables."
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    if (!appUrl) {
      return new Response(
        JSON.stringify({
          error: "App URL is missing. Add VITE_APP_URL or APP_URL to environment variables."
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
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
      return new Response(
        JSON.stringify({
          error: paystackData.message || "Failed to initialize Paystack payment",
          details: paystackData
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    return new Response(
      JSON.stringify({
        status: true,
        message: "Payment initialized",
        reference,
        payment_url: paystackData.data.authorization_url,
        access_code: paystackData.data.access_code,
        raw: paystackData.data
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message || "Unexpected server error"
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
}