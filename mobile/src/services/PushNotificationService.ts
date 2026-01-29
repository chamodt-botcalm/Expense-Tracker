import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { API_URL } from '../config/env';

let channelReady = false;

export async function ensureNotifChannel() {
  if (channelReady) return;
  await notifee.createChannel({
    id: 'default',
    name: 'Default',
    importance: AndroidImportance.HIGH,
  });
  channelReady = true;
}

export async function requestPushPermission() {
  await messaging().requestPermission();
}

export async function getFcmToken(): Promise<string | null> {
  try {
    const token = await messaging().getToken();
    return token || null;
  } catch {
    return null;
  }
}

export async function saveTokenToBackend(userId: string, token: string) {
  try {
    await fetch(`${API_URL}/api/notifications/save-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, fcm_token: token }),
    });
  } catch (e) {
    // silent
  }
}

export async function showLocalNotification(title: string, body: string) {
  await ensureNotifChannel();
  await notifee.displayNotification({
    title,
    body,
    android: {
      channelId: 'default',
      pressAction: { id: 'default' },
    },
  });
}

// Foreground push handling
export function listenForegroundPush(onBanner?: (title: string, body: string) => void) {
  return messaging().onMessage(async (remoteMessage) => {
    const title = remoteMessage.notification?.title ?? 'PulseSpend';
    const body = remoteMessage.notification?.body ?? '';
    if (title || body) {
      await showLocalNotification(title, body);
      if (onBanner) onBanner(title, body);
    }
  });
}

export async function initPushForLoggedInUser(userId: string) {
  await ensureNotifChannel();
  await requestPushPermission();

  const token = await getFcmToken();
  if (token) {
    await saveTokenToBackend(userId, token);
  }

  // Token refresh support
  messaging().onTokenRefresh(async (newToken) => {
    if (newToken) {
      await saveTokenToBackend(userId, newToken);
    }
  });
}
