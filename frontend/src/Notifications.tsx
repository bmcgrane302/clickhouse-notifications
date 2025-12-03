import React, { useEffect, useState } from 'react';
import { socket } from './socket';

type Notification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
};

type Props = {
  userId: string;
};

export const Notifications: React.FC<Props> = ({ userId }) => {
  const [items, setItems] = useState<Notification[]>([]);

  useEffect(() => {
    // Register this user with the WebSocket server
    socket.emit('register', userId);

    // Listen for real-time notifications
    socket.on('notification', (notification: Notification) => {
      setItems((prev) => [notification, ...prev]);
    });

    // Optional: load existing notifications on first mount
    fetch(`http://localhost:4000/notify/user/${userId}`)
      .then((res) => res.json())
      .then((data: Notification[]) => {
        setItems(data.reverse()); // oldest first, newest later + socket events
      })
      .catch((err) => console.error('Failed to fetch notifications', err));

    return () => {
      socket.off('notification');
    };
  }, [userId]);

  return (
    <div>
      <h2>Live Notifications</h2>
      {items.length === 0 && <p>No notifications yet.</p>}
      {items.map((n) => (
        <div
          key={n.id}
          style={{
            border: '1px solid #ddd',
            borderRadius: '6px',
            padding: '0.75rem',
            marginBottom: '0.5rem',
          }}
        >
          <strong>{n.title}</strong>
          <p style={{ margin: '0.25rem 0' }}>{n.message}</p>
          <small>{new Date(n.createdAt).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
};
