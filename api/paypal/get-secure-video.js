export default async function handler(req, res) {
  const { id } = req.query;

  // 🚨 TODO: check if user has paid (we’ll add next)
  
  const secureUrl = `https://videodelivery.net/${id}/manifest/video.m3u8`;

  res.status(200).json({ url: secureUrl });
}