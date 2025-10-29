import express from "express";
import admin from "firebase-admin";

import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(express.json());

app.get("/", (req, res) => res.send("✅ API is running!"));

app.post("/send", async (req, res) => {
  const { token, title, body } = req.body;
  try {
    await admin.messaging().send({
      token,
      notification: { title, body },
    });
    res.send({ success: true });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
