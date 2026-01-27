import admin from "firebase-admin";

// ✅ You must set GOOGLE_APPLICATION_CREDENTIALS env var
// OR load service account json manually.
// Recommended: set env var to your serviceAccountKey.json path.
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

export async function sendPushToTokens(
  tokens: string[],
  title: string,
  body: string,
  data?: Record<string, string>
) {
  if (!tokens || tokens.length === 0) return;

  const message: admin.messaging.MulticastMessage = {
    tokens,
    notification: { title, body },
    data: data ?? {},
    android: { priority: "high" },
  };

  try {
    await admin.messaging().sendEachForMulticast(message);
  } catch (err) {
    console.error("FCM push error:", err);
  }
}
