// shared/mockClickhouseData.ts

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
    name: 'Acme ClickHouse Org'
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
  }
];
