import * as Notifications from "expo-notifications";

export default async function cancelNotification(notificationId: string) {
  try {
    if (notificationId !== "null")
      await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error("Error canceling notification:", error);
  }
}
