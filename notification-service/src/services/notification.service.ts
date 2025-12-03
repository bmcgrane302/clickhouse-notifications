import { v4 as uuid } from 'uuid';
import { ClickHouseService } from './clickhouse.service';
import { EmailService } from './email.service';
import { NotificationStore } from '../store/inMemoryStore';
import { ServiceChangeEvent, Notification } from '../types';
import { io } from '../websocket';

export const NotificationService = {
  async notifyServiceChange(event: ServiceChangeEvent): Promise<void> {
    const users = await ClickHouseService.getUsersForOrg(event.orgId);

    for (const user of users) {
      const notification: Notification = {
        id: uuid(),
        userId: user.id,
        title: 'Service Updated',
        message: `Service ${event.serviceId} was ${event.changeType.toLowerCase()} by ${event.changedBy}`,
        createdAt: new Date().toISOString(),
        read: false
      };

      // Save in-app
      NotificationStore.save(notification);

      // Emit real-time via WebSocket
      if (io) {
        io.to(user.id).emit('notification', notification);
      }

      // Send mock email
      await EmailService.send(
        user.email,
        'Service Change Notification',
        notification.message
      );
    }
  }
};
