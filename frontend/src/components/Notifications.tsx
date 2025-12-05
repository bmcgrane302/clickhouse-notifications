// import React, { useEffect, useState } from 'react';
// import { socket } from './socket';

// type Notification = {
//   id: string;
//   userId: string;
//   title: string;
//   message: string;
//   createdAt: string;
//   read: boolean;
// };

// type Props = {
//   userId: string;
// };

// export const Notifications: React.FC<Props> = ({ userId }) => {
//   const [items, setItems] = useState<Notification[]>([]);

//   useEffect(() => {
//     // Register this user with the WebSocket server
//     socket.emit('register', userId);

//     // Listen for real-time notifications
//     socket.on('notification', (notification: Notification) => {
//       setItems((prev) => [notification, ...prev]);
//     });

//     // Optional: load existing notifications on first mount
//     fetch(`http://localhost:4000/notify/user/${userId}`)
//       .then((res) => res.json())
//       .then((data: Notification[]) => {
//         setItems(data.reverse()); // oldest first, newest later + socket events
//       })
//       .catch((err) => console.error('Failed to fetch notifications', err));

//     return () => {
//       socket.off('notification');
//     };
//   }, [userId]);

//   return (
//     <div>
//       <h2>Live Notifications</h2>
//       {items.length === 0 && <p>No notifications yet.</p>}
//       {items.map((n) => (
//         <div
//           key={n.id}
//           style={{
//             border: '1px solid #ddd',
//             borderRadius: '6px',
//             padding: '0.75rem',
//             marginBottom: '0.5rem',
//           }}
//         >
//           <strong>{n.title}</strong>
//           <p style={{ margin: '0.25rem 0' }}>{n.message}</p>
//           <small>{new Date(n.createdAt).toLocaleString()}</small>
//         </div>
//       ))}
//     </div>
//   );
// };

import { memo, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import type { Notification } from '../types/domain';


// type Notification = {
//   id: string;
//   title: string;
//   message: string;
//   createdAt: string;
// };

const socket = io('http://localhost:4000');

export function NotificationsComponent({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    socket.emit('register', userId);

    socket.on('notification', (notification: Notification) => {
      console.log('Received notification:', notification);
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      socket.off('notification');
    };
  }, [userId]);


  return (
    <div>
      <h2>Live Notifications</h2>
      <ul>
        {notifications.map((n) => (
          <li key={n.id}>
            <strong>{n.title}</strong>
            <p>{n.message}</p>
            <small>{new Date(n.createdAt).toLocaleTimeString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const Notifications = memo(NotificationsComponent);