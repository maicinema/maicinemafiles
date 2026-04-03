export default async function handler(req, res) {
  const { id } = req.query;

  // 🚨 TODO: check if user has paid (we’ll add next)
  
  const secureUrl = `https://videodelivery.net/${id}/manifest/video.m3u8`;

  res.status(200).json({ url: secureUrl });
}

// Example logic
const userId = req.headers.userid;

const hasAccess = await checkIfUserPaid(userId, id);

if (!hasAccess) {
  return res.status(403).json({ error: "Access denied" });
}