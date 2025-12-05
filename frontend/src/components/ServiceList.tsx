import { useState } from 'react';
import type { Service } from '../types/domain';


type Props = {
  services: Service[];
  orgId: string;
  changedByEmail: string;
  onServicesUpdated: (services: Service[]) => void;
};

export function ServiceList({
  services,
  orgId,
  changedByEmail,
  onServicesUpdated
}: Props) {
  const [loading, setLoading] = useState<string | null>(null);

  const statusToChangeType: Record<string, 'STARTED' | 'STOPPED'> = {
    running: 'STARTED',
    stopped: 'STOPPED'
  };

  const handleAction = async (
    service: Service,
    action: 'start' | 'stop' | 'schedule'
  ) => {
    setLoading(service.id);

    try {
      if (action === 'schedule') {
        await fetch('http://localhost:4000/notify/service-change', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orgId,
            serviceId: service.id,
            changeType: 'DELETED',
            changedBy: changedByEmail
          })
        });

        onServicesUpdated(
          services.map((s) =>
            s.id === service.id
              ? { ...s, scheduledForDeletion: true }
              : s
          )
        );

        return;
      }

      const toggleRes = await fetch(
        `http://localhost:5000/services/${service.id}/toggle`,
        { method: 'POST' }
      );

      const updatedService = await toggleRes.json();

      const changeType = statusToChangeType[updatedService.status];
      await fetch('http://localhost:4000/notify/service-change', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orgId,
          serviceId: service.id,
          changeType,
          changedBy: changedByEmail
        })
      });

      onServicesUpdated(
        services.map((svc) =>
          svc.id === service.id
            ? { ...updatedService, scheduledForDeletion: svc.scheduledForDeletion }
            : svc
        )
      );
    } finally {
      setLoading(null);
    }
  };

  return (
    <div>
      <h2>Services</h2>

      <table
        style={{
          width: '100%',
          tableLayout: 'fixed',
        }}
      >
        <thead>
          <tr>
            <th style={{ width: '35%' }}>Name</th>
            <th style={{ width: '20%' }}>Region</th>
            <th style={{ width: '15%' }}>Status</th>
            <th style={{ width: '20%' }}>Lifecycle</th>
            <th style={{ width: '10%' }}>Action</th>
          </tr>
        </thead>

        <tbody>
          {services.map((svc) => (
            <tr
              key={svc.id}
              style={{
                opacity: svc.scheduledForDeletion ? 0.6 : 1
              }}
            >
              <td style={{ height: 40 }}>{svc.name}</td>
              <td style={{ height: 40 }}>{svc.region}</td>
              <td style={{ height: 40 }}>{svc.status}</td>
              <td style={{ height: 40 }}>
                {svc.scheduledForDeletion
                  ? 'Scheduled for Deletion'
                  : 'Active'}
              </td>

              <td style={{ height: 40 }}>
                <select
                  disabled={
                    loading === svc.id || svc.scheduledForDeletion
                  }
                  defaultValue=""
                  onChange={(e) => {
                    const action = e.target.value as
                      | 'start'
                      | 'stop'
                      | 'schedule';

                    if (!action) return;

                    handleAction(svc, action);

                    e.currentTarget.value = '';
                  }}
                >
                  <option value="" disabled>
                    Select
                  </option>

                  <option
                    value="start"
                    disabled={svc.status === 'running'}
                  >
                    Start
                  </option>

                  <option
                    value="stop"
                    disabled={svc.status === 'stopped'}
                  >
                    Stop
                  </option>

                  <option value="schedule">
                    Schedule for Deletion
                  </option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
