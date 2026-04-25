export async function onRequestPost(context) {
  try {
    const { emails, message } = await context.request.json();

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return Response.json({ error: "No emails provided" }, { status: 400 });
    }

    if (!message) {
      return Response.json({ error: "Message is required" }, { status: 400 });
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
          from: "MaiCinema <updates@maicinema.com>",
          to: email,
          subject: "MaiCinema Update",
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2>MaiCinema</h2>
              <p>${message}</p>
            </div>
          `
        })
      });

      results.push({
        email,
        success: res.ok
      });
    }

    return Response.json({ success: true, results });
  } catch (error) {
    return Response.json(
      { error: error.message || "Newsletter send failed" },
      { status: 500 }
    );
  }
}