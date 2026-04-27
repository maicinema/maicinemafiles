export async function onRequest(context) {
  // ✅ Handle preflight (CORS)
  if (context.request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  }

  // ✅ Only allow POST
  if (context.request.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: corsHeaders()
      }
    );
  }

  try {
    const { emails, message } = await context.request.json();

    if (!context.env.RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Missing RESEND_API_KEY" }),
        {
          status: 500,
          headers: corsHeaders()
        }
      );
    }

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return new Response(
        JSON.stringify({ error: "No emails provided" }),
        {
          status: 400,
          headers: corsHeaders()
        }
      );
    }

    if (!message || !message.trim()) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        {
          status: 400,
          headers: corsHeaders()
        }
      );
    }

    const results = [];

    for (const email of emails) {
      const res = await fetch("https://maicinemafiles.pages.dev/api/send-newsletter", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    emails: emails,
    message: newsletterMessage
  })
});

      const text = await res.text();

      results.push({
        email,
        success: res.ok,
        response: text
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        results
      }),
      {
        status: 200,
        headers: corsHeaders()
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message || "Newsletter send failed"
      }),
      {
        status: 500,
        headers: corsHeaders()
      }
    );
  }
}

// ✅ Reusable CORS headers
function corsHeaders() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}