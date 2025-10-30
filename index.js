import admin from "firebase-admin";

// Initialize Firebase only once
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { tokens, title, body, imageUrl } = req.body;

    if (!tokens || !Array.isArray(tokens) || tokens.length === 0) {
      return res.status(400).json({ error: "No tokens provided" });
    }

    if (!title || !body) {
      return res.status(400).json({ error: "Missing title or body" });
    }

    const payload = {
      notification: { title, body, image: imageUrl || undefined },
      data: { click_action: "FLUTTER_NOTIFICATION_CLICK" },
    };

    // Use sendEachForMulticast for multiple tokens
    const response = await admin.messaging().sendEachForMulticast({
      tokens,
      ...payload,
    });

    return res.status(200).json({
      success: true,
      sent: response.successCount,
      failed: response.failureCount,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
