export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { email, answer1, answer2, answer3, secret } = req.body

  if (secret !== "quiz123") {
    return res.status(401).json({ error: "Unauthorized" })
  }

  console.log({ email, answer1, answer2, answer3 })

  return res.status(200).json({ ok: true })
}