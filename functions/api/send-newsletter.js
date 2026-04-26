export async function onRequestPost(context) {
  try {
    const { emails, message } = await context.request.json();

    if (!context.env.RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Missing RESEND_API_KEY" }),
        { headers: { "Content-Type": "application/json" }, status: 500 }
      );
    }

    if (!emails || emails.length === 0) {
      return new Response(
        JSON.stringify({ error: "No emails provided" }),
        { headers: { "Content-Type": "application/json" }, status: 400 }
      );
    }

    if (!message) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { headers: { "Content-Type": "application/json" }, status: 400 }
      );
    }

    const results = [];

    for (const email of emails) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${context.env.RESEND_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
         from: "MaiCinema <no-reply@maicinema.com>",
to: email,
          subject: "MaiCinema Update",
          html: `<p>${message}</p>`
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
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message
      }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    );
  }
}