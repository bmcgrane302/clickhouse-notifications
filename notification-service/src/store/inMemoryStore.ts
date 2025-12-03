import { Notification } from '../types';

const notifications: Notification[] = [];

export const NotificationStore = {
  save(notification: Notification) {
    notifications.push(notification);
  },

  getByUser(userId: string): Notification[] {
    return notifications.filter((n) => n.userId === userId);
  }
};
