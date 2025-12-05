export type User = {
  id: string;
  name: string;
  email: string;
  orgId: string;
};

export type Organization = {
  id: string;
  name: string;
};

export type Service = {
  id: string;
  name: string;
  status: 'running' | 'stopped';
  region: string;
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
};

export type LoginResponse = {
  user: {
    id: string;
    name: string;
    email: string;
    orgId: string;
  };
  organization: {
    id: string;
    name: string;
  };
};
