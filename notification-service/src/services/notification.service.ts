import { v4 as uuid } from 'uuid';
import { NotificationStore } from '../store/inMemoryStore';
import { EmailService } from './email.service';
import { ServiceChangeEvent, Notification } from '../types';
import { io } from '../websocket';

const CLICKHOUSE_API = 'http://localhost:5000';

type OrgUser = {
  id: string;
  email: string;
  name: string;
  orgId: string;
};

type Service = {
  id: string;
  name: string;
  status: 'running' | 'stopped';
  region: string;
  orgId: string;
};

/**
 * Enriched event consumer:
 * - Accepts minimal change event
 * - Fetches users + service metadata from mock-clickhouse-api
 * - Fans out via WebSocket + Email + In-App store
 */
export const NotificationService = {
  async notifyServiceChange(event: ServiceChangeEvent) {
    try {
      // 1. Fetch affected users from ClickHouse API
      const usersRes = await fetch(
        `${CLICKHOUSE_API}/org/${event.orgId}/users`
      );

      if (!usersRes.ok) {
        throw new Error(
          `Failed to fetch users for org ${event.orgId}: ${usersRes.status}`
        );
      }

      const affectedUsers: OrgUser[] = await usersRes.json();

      // 2. Fetch service metadata
      const svcRes = await fetch(
        `${CLICKHOUSE_API}/services/by-id/${event.serviceId}`
      );

      if (!svcRes.ok) {
        throw new Error(
          `Failed to fetch service ${event.serviceId}: ${svcRes.status}`
        );
      }

      const service: Service = await svcRes.json();

      // 3. Fan out notifications
      for (const user of affectedUsers) {
        const notification: Notification = {
          id: uuid(),
          userId: user.id,
          title: `Service ${event.changeType}`,
          message: `${service.name} (${service.region}) was ${event.changeType.toLowerCase()} by ${event.changedBy}`,
          createdAt: new Date().toISOString(),
          read: false
        };

        // Save in-app notification
        NotificationStore.save(notification);

        // Emit via WebSocket (room = user.id)
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
      console.error('❌ Notification enrichment failed:', err);
      throw err;
    }
  }
};
