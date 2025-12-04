// import React, { useState } from 'react';
// import type { Service } from './mockData';
// import { MOCK_USER } from './mockData';

// type Props = {
//   initialServices: Service[];
// };

// export const ServiceList: React.FC<Props> = ({ initialServices }) => {
//   const [services, setServices] = useState<Service[]>(initialServices);
//   const [statusMessage, setStatusMessage] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const triggerChange = async (service: Service) => {
//     setIsLoading(true);
//     setStatusMessage(`Applying change to ${service.name}...`);

//     try {
//       // Toggle status locally to simulate a config/operational change
//       const newStatus = service.status === 'running' ? 'stopped' : 'running';

//       // Call backend Notification Service (no direct ClickHouse call)
//       const res = await fetch('http://localhost:4000/notify/service-change', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           orgId: MOCK_USER.orgId,
//           serviceId: service.id,
//           changeType: 'UPDATED',          // Our backend union type
//           changedBy: MOCK_USER.email
//         })
//       });

//       if (!res.ok) {
//         throw new Error(`Request failed with status ${res.status}`);
//       }

//       // Update UI to reflect the change
//       setServices(prev =>
//         prev.map(s =>
//           s.id === service.id ? { ...s, status: newStatus } : s
//         )
//       );

//       setStatusMessage(
//         `Change applied to ${service.name}. Status is now ${newStatus}.`
//       );
//     } catch (err) {
//       console.error(err);
//       setStatusMessage('Error applying change. See console for details.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h2>Services in {MOCK_USER.orgName}</h2>
//       <p style={{ marginBottom: '0.75rem' }}>
//         Select a service and apply a change to trigger notifications for all users in the org.
//       </p>

//       <table
//         style={{
//           width: '100%',
//           borderCollapse: 'collapse',
//           marginBottom: '0.75rem'
//         }}
//       >
//         <thead>
//           <tr>
//             <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '0.5rem' }}>Name</th>
//             <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '0.5rem' }}>Service ID</th>
//             <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '0.5rem' }}>Region</th>
//             <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '0.5rem' }}>Status</th>
//             <th style={{ borderBottom: '1px solid #ddd', padding: '0.5rem' }}>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {services.map(service => (
//             <tr key={service.id}>
//               <td style={{ padding: '0.5rem', borderBottom: '1px solid #f0f0f0' }}>{service.name}</td>
//               <td style={{ padding: '0.5rem', borderBottom: '1px solid #f0f0f0' }}>{service.id}</td>
//               <td style={{ padding: '0.5rem', borderBottom: '1px solid #f0f0f0' }}>{service.region}</td>
//               <td style={{ padding: '0.5rem', borderBottom: '1px solid #f0f0f0' }}>
//                 <span
//                   style={{
//                     padding: '0.15rem 0.5rem',
//                     borderRadius: '999px',
//                     fontSize: '12px',
//                     background:
//                       service.status === 'running' ? '#d1fae5' : '#fee2e2',
//                     color:
//                       service.status === 'running' ? '#065f46' : '#991b1b'
//                   }}
//                 >
//                   {service.status}
//                 </span>
//               </td>
//               <td style={{ textAlign: 'center', padding: '0.5rem', borderBottom: '1px solid #f0f0f0' }}>
//                 <button
//                   onClick={() => triggerChange(service)}
//                   disabled={isLoading}
//                 >
//                   {service.status === 'running'
//                     ? 'Stop Service (Update)'
//                     : 'Start Service (Update)'}
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {statusMessage && (
//         <p style={{ fontSize: '0.9rem' }}>
//           {isLoading ? '⏳ ' : '✅ '} {statusMessage}
//         </p>
//       )}
//     </div>
//   );
// };
import { useState } from 'react';

type Service = {
  id: string;
  name: string;
  status: 'running' | 'stopped';
  region: string;
};

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

  const toggleService = async (service: Service) => {
    setLoading(service.id);

    try {
      // 1. Toggle in Mock ClickHouse API
      const toggleRes = await fetch(
        `http://localhost:5000/services/${service.id}/toggle`,
        { method: 'POST' }
      );

      const updatedService = await toggleRes.json();
      console.log('Service toggled:', updatedService);

      // 2. Notify Notification Service
      await fetch('http://localhost:4000/notify/service-change', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orgId,
          serviceId: service.id,
          changeType: updatedService.status,
          changedBy: changedByEmail
        })
      });

      // 3. Update UI state
      onServicesUpdated(
        services.map((s) =>
          s.id === service.id ? updatedService : s
        )
      );
    } finally {
      setLoading(null);
    }
  };

  return (
    <div>
      <h2>Services</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Region</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {services.map((svc) => (
            <tr key={svc.id}>
              <td>{svc.name}</td>
              <td>{svc.region}</td>
              <td>{svc.status}</td>
              <td>
                <button onClick={() => toggleService(svc)}>
                  {loading === svc.id
                    ? 'Updating...'
                    : 'Toggle'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

