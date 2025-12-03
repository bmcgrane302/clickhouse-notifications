import { Notifications } from './Notifications';
import { ServiceList } from './ServiceList';
import { MOCK_USER, MOCK_SERVICES } from './mockData';

function App() {
  const userId = MOCK_USER.id;

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>ClickHouse Notification Demo</h1>

      <div style={{ marginBottom: '1rem' }}>
        <p style={{ margin: 0 }}>
          Logged in as: <strong>{MOCK_USER.name}</strong> ({MOCK_USER.email})
        </p>
        <p style={{ margin: 0 }}>
          Organization: <strong>{MOCK_USER.orgName}</strong> (ID: {MOCK_USER.orgId})
        </p>
      </div>

      <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <ServiceList initialServices={MOCK_SERVICES} />
        </div>
        <div style={{ flex: 1 }}>
          <Notifications userId={userId} />
        </div>
      </div>
    </div>
  );
}

export default App;
