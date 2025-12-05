import { memo, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import type { Notification } from '../types/domain';


const socket = io('http://localhost:4000');

type Props = {
  userId: string;
  onUnreadCountChange: (count: number) => void;
  visible: boolean;
};

function NotificationsComponent({ userId, onUnreadCountChange, visible }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    fetch(`http://localhost:4000/notify/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data);
        onUnreadCountChange(data.filter((n: Notification) => !n.read).length);
      });
  }, [userId, onUnreadCountChange]);

  useEffect(() => {
    socket.emit('register', userId);

    const handler = (notification: Notification) => {
      setNotifications((prev) => {
        const updated = [notification, ...prev];
        onUnreadCountChange(updated.filter((n) => !n.read).length);
        return updated;
      });
    };

    socket.on('notification', handler);

    return () => {
      socket.off('notification', handler);
    };
  }, [userId, onUnreadCountChange]);

  if (!visible) return null;

  return (
    <div style={{
      minHeight: 260,
      width: '100%',
      maxWidth: 420,
      boxSizing: 'border-box'
    }}>
      <h2>Notifications</h2>
       {notifications.length === 0 && (<p>No notifications</p>)}

      <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
        {notifications.map((n) => (
          <li
            key={n.id}
            onClick={() => {
              setNotifications((prev) => {
                const updated = prev.map((x) =>
                  x.id === n.id ? { ...x, read: true } : x
                );
                onUnreadCountChange(updated.filter((x) => !x.read).length);
                return updated;
              });
            }}
            style={{
              background: n.read ? '#f1f1f1' : '#e3f2ff',
              border: n.read ? '1px solid #ddd' : '1px solid #0077ff'
            }}
            className="card"
          >
            <strong>
              {n.title} {!n.read && ' •'}
            </strong>
            <p>{n.message}</p>
            <small>
              {new Date(n.createdAt).toLocaleTimeString()}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const Notifications = memo(NotificationsComponent);
