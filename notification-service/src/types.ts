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
