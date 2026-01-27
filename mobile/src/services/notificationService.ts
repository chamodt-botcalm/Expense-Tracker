import messaging from "@react-native-firebase/messaging";
import notifee, { AndroidImportance } from "@notifee/react-native";
import api from "../config/api"; // axios instance

export async function requestNotificationPermission() {
  await messaging().requestPermission();
}

export async function getAndSaveFcmToken(userId: string | number) {
  const token = await messaging().getToken();
  if (!token) return;

  await api.post("/notifications/save-token", {
    user_id: userId,
    fcm_token: token,
  });
}

export async function setupNotifeeChannel() {
  await notifee.createChannel({
    id: "default",
    name: "Default",
    importance: AndroidImportance.HIGH,
  });
}

export async function showLocalNotification(title: string, body: string) {
  await notifee.displayNotification({
    title,
    body,
    android: {
      channelId: "default",
      pressAction: { id: "default" },
    },
  });
}

// Foreground FCM
export function listenForegroundMessages() {
  return messaging().onMessage(async (msg) => {
    const title = msg.notification?.title ?? "Notification";
    const body = msg.notification?.body ?? "";
    await showLocalNotification(title, body);
  });
}

// Background handler (put in index.js too if needed)
export function registerBackgroundHandler() {
  messaging().setBackgroundMessageHandler(async (msg) => {
    const title = msg.notification?.title ?? "Notification";
    const body = msg.notification?.body ?? "";
    await showLocalNotification(title, body);
  });
}
