import { Notifications } from './Notifications';
import { ServiceEditor } from './ServiceEditor';

const USER_ID = 'user-1'; // matches mocked backend users

function App() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Notification Demo</h1>
      <p>Logged in as: <strong>{USER_ID}</strong></p>

      <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
        <div style={{ flex: 1 }}>
          <ServiceEditor />
        </div>
        <div style={{ flex: 1 }}>
          <Notifications userId={USER_ID} />
        </div>
      </div>
    </div>
  );
}

export default App;
