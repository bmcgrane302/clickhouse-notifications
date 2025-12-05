type Props = {
  orgName: string;
  userEmail: string;
  unreadCount: number;
  onToggleNotifications: () => void;
  showNotifications: boolean;
};

export function Navbar({
  orgName,
  userEmail,
  unreadCount,
  onToggleNotifications
}: Props) {
  return (
    <div
      style={{
        padding: '12px 20px',
        borderBottom: '1px solid #ddd',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#fff'
      }}
    >
      <div>
        <strong>{orgName}</strong>
        <span style={{ marginLeft: 16, color: '#666' }}>
          Logged in as {userEmail}
        </span>
      </div>

      <button
        onClick={onToggleNotifications}
        style={{
          position: 'relative',
          padding: '6px 14px',
          cursor: 'pointer'
        }}
      >
        Notifications

        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: -6,
              right: -6,
              background: 'red',
              color: '#fff',
              borderRadius: '50%',
              width: 20,
              height: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}
