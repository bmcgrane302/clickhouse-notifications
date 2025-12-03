export type Service = {
  id: string;
  name: string;
  status: 'running' | 'stopped';
  region: string;
};

export const MOCK_USER = {
  id: 'user-1',              // matches backend mocked users
  name: 'Brian McGrane',
  email: 'user1@example.com',
  orgId: 'org-1',
  orgName: 'Acme ClickHouse Org'
};

export const MOCK_SERVICES: Service[] = [
  {
    id: 'svc-101',
    name: 'Analytics Cluster',
    status: 'running',
    region: 'us-east-1'
  },
  {
    id: 'svc-102',
    name: 'Reporting Cluster',
    status: 'running',
    region: 'eu-west-1'
  },
  {
    id: 'svc-103',
    name: 'Batch Ingest',
    status: 'stopped',
    region: 'us-west-2'
  }
];
