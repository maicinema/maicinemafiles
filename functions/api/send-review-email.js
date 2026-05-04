export default async function handler(req, res) {
  try {
    const { email, title, status, goLiveAt, note } = req.body;

    let subject = "";
    let html = "";

    if (status === "approved") {
      subject = `Your film "${title}" has been approved 🎬`;

      html = `
        <h2>Congratulations!</h2>
        <p>Your film <strong>${title}</strong> has been approved on MaiCinema.</p>
        <p><strong>Go Live:</strong> ${goLiveAt}</p>
        <p>Your film will be live as scheduled.</p>
        <br/>
        <p>— MaiCinema Team</p>
      `;
    }

    if (status === "rejected") {
      subject = `Update on your film submission`;

      html = `
        <h2>Submission Update</h2>
        <p>Your film <strong>${title}</strong> was not approved.</p>
        <p><strong>Reason:</strong> ${note || "Does not meet requirements."}</p>
        <p>You can improve and submit again.</p>
        <br/>
        <p>Focus on:</p>
        <ul>
          <li>Sound quality</li>
          <li>Picture quality</li>
          <li>Storytelling</li>
        </ul>
        <br/>
        <p>— MaiCinema Team</p>
      `;
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "MaiCinema <onboarding@resend.dev>",
        to: [email],
        subject,
        html,
      }),
    });

    const data = await response.json();

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}