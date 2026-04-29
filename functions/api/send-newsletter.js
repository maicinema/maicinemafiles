export async function onRequest(context) {
  if (context.request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }

  if (context.request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: corsHeaders()
    });
  }

  try {
    const { emails, message, filmTitle, filmLink, poster } =
      await context.request.json();

    if (!context.env.RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: "Missing RESEND_API_KEY" }), {
        status: 500,
        headers: corsHeaders()
      });
    }

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return new Response(JSON.stringify({ error: "No emails provided" }), {
        status: 400,
        headers: corsHeaders()
      });
    }

    const safeTitle = filmTitle || "New Film Available";
    const safeMessage = message || "Now streaming on MaiCinema";
    const safeLink = filmLink || "https://maicinema.com";

    const results = [];

    for (const email of emails) {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${context.env.RESEND_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: "MaiCinema <no-reply@maicinema.com>",
          to: email,
          subject: `${safeTitle} is now live on MaiCinema`,
          html: `
            <div style="background:#000;color:#fff;padding:24px;font-family:Arial,Helvetica,sans-serif;">
              <h2 style="color:#e50914;margin:0 0 20px;">MaiCinema</h2>

              <h1 style="margin:0 0 16px;font-size:28px;">
                ${safeTitle}
              </h1>

              ${
                poster
                  ? `<img src="${poster}" alt="${safeTitle}" style="width:100%;max-width:560px;border-radius:10px;margin:16px 0;display:block;" />`
                  : ""
              }

              <p style="font-size:16px;line-height:1.6;color:#ddd;">
                ${safeMessage}
              </p>

              <a href="${safeLink}"
                 style="display:inline-block;background:#e50914;color:#fff;padding:14px 22px;text-decoration:none;border-radius:6px;font-weight:bold;margin-top:18px;">
                ▶ Watch Now
              </a>

              <p style="font-size:12px;color:#777;margin-top:30px;">
                You are receiving this because you subscribed to MaiCinema updates.
              </p>
            </div>
          `
        })
      });

      const text = await res.text();

      results.push({
        email,
        success: res.ok,
        response: text
      });
    }

    return new Response(JSON.stringify({ success: true, results }), {
      status: 200,
      headers: corsHeaders()
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Newsletter send failed" }),
      { status: 500, headers: corsHeaders() }
    );
  }
}

function corsHeaders() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}