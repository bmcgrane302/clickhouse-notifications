import React, { useState } from 'react';

export const ServiceEditor: React.FC = () => {
  const [orgId, setOrgId] = useState('org-1');
  const [serviceId, setServiceId] = useState('svc-123');
  const [changeType, setChangeType] = useState<'CREATED' | 'UPDATED' | 'DELETED'>('UPDATED');
  const [changedBy, setChangedBy] = useState('brian@clickhouse.com');
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Sending...');

    try {
      const res = await fetch('http://localhost:4000/notify/service-change', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orgId,
          serviceId,
          changeType,
          changedBy,
        }),
      });

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      setStatus('Notification event sent!');
    } catch (err: any) {
      console.error(err);
      setStatus('Error sending notification');
    }
  };

  return (
    <div>
      <h2>Simulate Service Change</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '320px' }}>
        <label>
          Org ID
          <input value={orgId} onChange={(e) => setOrgId(e.target.value)} />
        </label>
        <label>
          Service ID
          <input value={serviceId} onChange={(e) => setServiceId(e.target.value)} />
        </label>
        <label>
          Change Type
          <select
            value={changeType}
            onChange={(e) => setChangeType(e.target.value as any)}
          >
            <option value="CREATED">CREATED</option>
            <option value="UPDATED">UPDATED</option>
            <option value="DELETED">DELETED</option>
          </select>
        </label>
        <label>
          Changed By
          <input value={changedBy} onChange={(e) => setChangedBy(e.target.value)} />
        </label>

        <button type="submit" style={{ marginTop: '0.5rem' }}>
          Send Notification
        </button>
      </form>
      {status && <p style={{ marginTop: '0.5rem' }}>{status}</p>}
    </div>
  );
};
