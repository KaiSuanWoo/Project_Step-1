import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleMorningIntent(hour = 8, minute = 0) {
  await Notifications.cancelScheduledNotificationAsync('morning-intent').catch(() => {});
  await Notifications.scheduleNotificationAsync({
    identifier: 'morning-intent',
    content: {
      title: "Morning check-in",
      body: "What's your one step today?",
      sound: true,
    },
    trigger: { hour, minute, type: Notifications.SchedulableTriggerInputTypes.DAILY },
  });
}

export async function scheduleEveningCheckIn(hour = 20, minute = 0) {
  await Notifications.cancelScheduledNotificationAsync('evening-check-in').catch(() => {});
  await Notifications.scheduleNotificationAsync({
    identifier: 'evening-check-in',
    content: {
      title: "Evening reflection",
      body: "Did you take your step today?",
      sound: true,
    },
    trigger: { hour, minute, type: Notifications.SchedulableTriggerInputTypes.DAILY },
  });
}

export async function scheduleStreakAlert(habitTitle: string, streakCount: number) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${streakCount}-day streak!`,
      body: `Keep going on "${habitTitle}" — don't break the chain.`,
      sound: true,
    },
    trigger: null, // immediate
  });
}

export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
