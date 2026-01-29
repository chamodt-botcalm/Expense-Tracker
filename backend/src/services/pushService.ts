import admin from 'firebase-admin';
import { sql } from '../config/db';

let initAttempted = false;
let enabled = false;
let disabledReason: string | null = null;

function initFirebaseOnce() {
  if (initAttempted) return;
  initAttempted = true;

  try {
    if (admin.apps.length) {
      enabled = true;
      return;
    }

    // Option 1: JSON string in env FIREBASE_SERVICE_ACCOUNT_JSON
    const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (json && json.trim().length > 0) {
      const serviceAccount = JSON.parse(json);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      enabled = true;
      return;
    }

    // Option 2: Application Default Credentials (works with GOOGLE_APPLICATION_CREDENTIALS)
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
    enabled = true;
  } catch (err: any) {
    enabled = false;
    disabledReason = err?.message || 'Firebase init failed';
    console.warn('[Push] Disabled:', disabledReason);
  }
}

export function isPushEnabled() {
  initFirebaseOnce();
  return enabled;
}

export function getPushDisabledReason() {
  initFirebaseOnce();
  return disabledReason;
}

export async function saveUserToken(userId: string | number, token: string) {
  const uid = String(userId);
  const t = String(token);
  if (!uid || !t) return;

  await sql`
    INSERT INTO user_fcm_tokens (user_id, token)
    VALUES (${uid}, ${t})
    ON CONFLICT (token) DO UPDATE SET user_id = EXCLUDED.user_id
  `;
}

async function getUserTokens(userId: string | number): Promise<string[]> {
  const uid = String(userId);
  const rows = await sql`SELECT token FROM user_fcm_tokens WHERE user_id = ${uid}`;
  return rows.map((r: any) => r.token).filter(Boolean);
}

async function removeTokens(tokens: string[]) {
  if (!tokens.length) return;
  await sql`DELETE FROM user_fcm_tokens WHERE token = ANY(${tokens}::text[])`;
}

export async function sendPushToUser(
  userId: string | number,
  title: string,
  body: string,
  data?: Record<string, string>
) {
  initFirebaseOnce();
  if (!enabled) return;

  const tokens = await getUserTokens(userId);
  if (!tokens.length) return;

  try {
    const msg: admin.messaging.MulticastMessage = {
      tokens,
      notification: { title, body },
      data: data ?? {},
      android: { priority: 'high' },
    };

    const resp = await admin.messaging().sendEachForMulticast(msg);

    // Clean up invalid tokens
    const invalid: string[] = [];
    resp.responses.forEach((r: any, idx: number) => {
      if (!r.success) {
        const code = (r.error as any)?.code || '';
        if (String(code).includes('registration-token-not-registered') ||
            String(code).includes('invalid-argument')) {
          invalid.push(tokens[idx]);
        }
      }
    });
    if (invalid.length) await removeTokens(invalid);
  } catch (err) {
    console.warn('[Push] send error:', err);
  }
}
