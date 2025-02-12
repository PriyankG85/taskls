import * as Notifications from "expo-notifications";

export default async function cancelNotification(
  notificationId: string | null | undefined
) {
  try {
    if (notificationId)
      await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error("Error canceling notification:", error);
  }
}
