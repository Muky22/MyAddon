import { google } from "googleapis"

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" })
    }

    const { email, answer1, answer2, answer3, secret } = req.body || {}

    if (secret !== "quiz123") {
      return res.status(401).json({ error: "Unauthorized" })
    }

    // 👉 Google Sheets API auth
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    const sheets = google.sheets({ version: "v4", auth })

    await sheets.spreadsheets.values.append({
      spreadsheetId: "1c-QNYRRdcieuNYOnuyUkR_nv0mJJEyTq",
      range: "Sheet1!A:D",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          new Date().toISOString(),
          email || "",
          answer1 || "",
          answer2 || "",
          answer3 || ""
        ]],
      },
    })

    return res.status(200).json({ ok: true })

  } catch (err) {
    console.error(err)

    return res.status(500).json({
      error: err.message,
    })
  }
}