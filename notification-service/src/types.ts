export type ServiceChangeEvent = {
  orgId: string;
  serviceId: string;
  changeType: 'CREATED' | 'UPDATED' | 'DELETED';
  changedBy: string;
};

export type Notification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
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
