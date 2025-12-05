import { useEffect, useState } from 'react';
import { Login } from './components/Login';
import { ServiceList } from './components/ServiceList';
import { Notifications } from './components/Notifications';
import { Navbar } from './components/Navbar';
import type { User, Organization, Service } from './types/domain';


export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [org, setOrg] = useState<Organization | null>(null);
  const [services, setServices] = useState<Service[]>([]);

  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:5000/services/${user.orgId}`)
      .then((res) => res.json())
      .then(setServices);
  }, [user]);

  if (!user) {
    return (
      <Login
        onLoginSuccess={(data) => {
          setUser(data.user);
          setOrg(data.organization);
        }}
      />
    );
  }

  return (
    <>
      <Navbar
        orgName={org?.name || ''}
        userEmail={user.email}
        unreadCount={unreadCount}
        showNotifications={showNotifications}
        onToggleNotifications={() =>
          setShowNotifications((prev) => !prev)
        }
      />

      <div
        style={{
          padding: '2rem',
          display: 'grid',
          gridTemplateColumns: showNotifications ? 'minmax(0, 2fr) minmax(320px, 1fr)' : '1fr',
          gap: '2rem',
          alignItems: 'start'
        }}
      >
        <ServiceList
          services={services}
          orgId={user.orgId}
          changedByEmail={user.email}
          onServicesUpdated={setServices}
        />

        <Notifications
          userId={user.id}
          visible={showNotifications}
          onUnreadCountChange={setUnreadCount}
        />
      </div>
    </>
  );
}
