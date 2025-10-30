import admin from "firebase-admin";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || "{}");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { tokens, title, body } = req.body;

    if (!tokens || !title || !body) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const message = {
      notification: { title, body },
      tokens,
    };

    const response = await admin.messaging().sendEachForMulticast(message);

    return res.status(200).json({ success: true, response });
  } catch (error) {
    console.error("Notification error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
