import { v4 as uuid } from 'uuid';
import { NotificationStore } from '../store/inMemoryStore';
import { EmailService } from './email.service';
import { ServiceChangeEvent, Notification, OrgUser, Service } from '../types';
import { io } from '../websocket';

const CLICKHOUSE_API = process.env.CLICKHOUSE_API || "http://localhost:5000";


export const NotificationService = {
  async notifyServiceChange(event: ServiceChangeEvent) {
    try {
      const usersRes = await fetch(
        `${CLICKHOUSE_API}/org/${event.orgId}/users`
      );

      if (!usersRes.ok) {
        throw new Error(
          `Failed to fetch users for org ${event.orgId}: ${usersRes.status}`
        );
      }

      const affectedUsers: OrgUser[] = await usersRes.json();

      const svcRes = await fetch(
        `${CLICKHOUSE_API}/services/by-id/${event.serviceId}`
      );

      if (!svcRes.ok) {
        throw new Error(
          `Failed to fetch service ${event.serviceId}: ${svcRes.status}`
        );
      }

      const service: Service = await svcRes.json();

      for (const user of affectedUsers) {
        const notification: Notification = {
          id: uuid(),
          userId: user.id,
          title: `Service ${event.changeType}`,
          message: `${service.name} (${service.region}) was ${event.changeType.toLowerCase()} by ${event.changedBy}`,
          createdAt: new Date().toISOString(),
          read: false
        };

        NotificationStore.save(notification);

        if (io) {
          io.to(user.id).emit('notification', notification);
        }

        // Send mock email
        await EmailService.send(
          user.email,
          `Service ${event.changeType}`,
          notification.message
        );
      }
    } catch (err) {
      console.error('Notification enrichment failed:', err);
      throw err;
    }
  }
};
