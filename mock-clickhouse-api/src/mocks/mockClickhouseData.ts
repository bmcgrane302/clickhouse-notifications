// -----------------------------
// Core Domain Types
// -----------------------------

export type Organization = {
  id: string;
  name: string;
};

export type OrgUser = {
  id: string;
  email: string;
  name: string;
  orgId: string;
};

export type Service = {
  id: string;
  name: string;
  status: 'running' | 'stopped';
  region: string;
  orgId: string;
};

// -----------------------------
// Mock Organizations
// -----------------------------

export const ORGANIZATIONS: Organization[] = [
  {
    id: 'org-1',
    name: 'Test ClickHouse Org'
  },
  {
    id: 'org-2',
    name: 'Beta ClickHouse Org'
  }
];

// -----------------------------
// Mock Users (Belong to Orgs)
// -----------------------------

export const ORG_USERS: OrgUser[] = [
  {
    id: 'user-1',
    email: 'user1@example.com',
    name: 'Brian McGrane',
    orgId: 'org-1'
  },
  {
    id: 'user-2',
    email: 'user2@example.com',
    name: 'Jane Doe',
    orgId: 'org-1'
  },
  {
    id: 'user-3',
    email: 'user3@example.com',
    name: 'Alice Smith',
    orgId: 'org-2'
  },
  {
    id: 'user-4',
    email: 'user4@example.com',
    name: 'Bob Johnson',
    orgId: 'org-2'
  }
];

// -----------------------------
// Mock Services (Belong to Orgs)
// -----------------------------

export const SERVICES: Service[] = [
  {
    id: 'svc-101',
    name: 'Analytics Cluster',
    status: 'running',
    region: 'us-east-1',
    orgId: 'org-1'
  },
  {
    id: 'svc-102',
    name: 'Reporting Cluster',
    status: 'running',
    region: 'eu-west-1',
    orgId: 'org-1'
  },
  {
    id: 'svc-103',
    name: 'Batch Ingest',
    status: 'stopped',
    region: 'us-west-2',
    orgId: 'org-1'
  },
  {
    id: 'svc-201',
    name: 'Data Warehouse',
    status: 'running',
    region: 'us-central-1',
    orgId: 'org-2'
  },
  {
    id: 'svc-202',
    name: 'Real-time Analytics',
    status: 'stopped',
    region: 'eu-central-1',
    orgId: 'org-2'
  }
];

