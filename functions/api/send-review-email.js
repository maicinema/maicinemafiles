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
    const { email, title, status, goLiveAt, note } =
      await context.request.json();

    if (!context.env.RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: "Missing RESEND_API_KEY" }), {
        status: 500,
        headers: corsHeaders()
      });
    }

    if (!email) {
      return new Response(JSON.stringify({ error: "No email provided" }), {
        status: 400,
        headers: corsHeaders()
      });
    }

    const safeTitle = title || "Your Film Submission";

    let subject = "";
    let html = "";

    if (status === "approved") {
      subject = `${safeTitle} has been approved on MaiCinema`;

      html = `
        <div style="background:#000;color:#fff;padding:24px;font-family:Arial,Helvetica,sans-serif;">
          <h2 style="color:#e50914;margin:0 0 20px;">MaiCinema</h2>
          <h1 style="margin:0 0 16px;font-size:26px;">Congratulations 🎬</h1>

          <p style="font-size:16px;line-height:1.6;color:#ddd;">
            Your film <strong>${safeTitle}</strong> has been approved on MaiCinema.
          </p>

          <p style="font-size:16px;line-height:1.6;color:#ddd;">
            It will go live on: <strong>${goLiveAt || "the scheduled date and time"}</strong>.
          </p>

          <p style="font-size:16px;line-height:1.6;color:#ddd;">
            Be ready to watch and share it when it becomes available.
          </p>

          <p style="font-size:13px;color:#777;margin-top:30px;">
            — MaiCinema Team
          </p>
        </div>
      `;
    }

    if (status === "rejected") {
      subject = `Update on your MaiCinema film submission`;

      html = `
        <div style="background:#000;color:#fff;padding:24px;font-family:Arial,Helvetica,sans-serif;">
          <h2 style="color:#e50914;margin:0 0 20px;">MaiCinema</h2>
          <h1 style="margin:0 0 16px;font-size:26px;">Submission Update</h1>

          <p style="font-size:16px;line-height:1.6;color:#ddd;">
            Your film <strong>${safeTitle}</strong> was not approved at this time.
          </p>

          <p style="font-size:16px;line-height:1.6;color:#ddd;">
            <strong>Reason:</strong> ${note || "It does not currently meet MaiCinema submission requirements."}
          </p>

          <p style="font-size:16px;line-height:1.6;color:#ddd;">
            You may submit again when the project has improved in areas such as sound quality,
            picture quality, storytelling, set design, costume, and overall production presentation.
          </p>

          <p style="font-size:13px;color:#777;margin-top:30px;">
            — MaiCinema Team
          </p>
        </div>
      `;
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${context.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "MaiCinema <no-reply@maicinema.com>",
        to: email,
        subject,
        html
      })
    });

    const text = await res.text();

    return new Response(
      JSON.stringify({
        success: res.ok,
        response: text
      }),
      {
        status: res.ok ? 200 : 500,
        headers: corsHeaders()
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Review email send failed" }),
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