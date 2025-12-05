// import { Notifications } from './Notifications';
// import { ServiceList } from './ServiceList';
// import { MOCK_USER, MOCK_SERVICES } from './mockData';

// function App() {
//   const userId = MOCK_USER.id;

//   return (
//     <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
//       <h1>ClickHouse Notification Demo</h1>

//       <div style={{ marginBottom: '1rem' }}>
//         <p style={{ margin: 0 }}>
//           Logged in as: <strong>{MOCK_USER.name}</strong> ({MOCK_USER.email})
//         </p>
//         <p style={{ margin: 0 }}>
//           Organization: <strong>{MOCK_USER.orgName}</strong> (ID: {MOCK_USER.orgId})
//         </p>
//       </div>

//       <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', alignItems: 'flex-start' }}>
//         <div style={{ flex: 1 }}>
//           <ServiceList initialServices={MOCK_SERVICES} />
//         </div>
//         <div style={{ flex: 1 }}>
//           <Notifications userId={userId} />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;

import { useEffect, useState } from 'react';
import { Login } from './components/Login';
import { ServiceList } from './components/ServiceList';
import { Notifications } from './components/Notifications';
import type { User, Organization, Service } from './types/domain';


// type User = {
//   id: string;
//   name: string;
//   email: string;
//   orgId: string;
// };

// type Organization = {
//   id: string;
//   name: string;
// };

// type Service = {
//   id: string;
//   name: string;
//   status: 'running' | 'stopped';
//   region: string;
// };

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [org, setOrg] = useState<Organization | null>(null);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:5000/services/${user.orgId}`)
      .then((res) => res.json())
      .then(setServices);
  }, [user]);

  if (!user) {
    return <Login onLoginSuccess={(data) => {
      setUser(data.user);
      setOrg(data.organization);
    }} />;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{org?.name}</h1>
      <p>Logged in as {user.email}</p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '2rem',
        alignItems: 'flex-start'
      }}>
        <ServiceList
          services={services}
          orgId={user.orgId}
          changedByEmail={user.email}
          onServicesUpdated={setServices}
        />

        <Notifications userId={user.id} />
      </div>
    </div>
  );
}

