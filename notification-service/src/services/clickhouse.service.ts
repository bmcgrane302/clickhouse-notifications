type OrgUser = {
  id: string;
  email: string;
};

export const ClickHouseService = {
  async getUsersForOrg(orgId: string): Promise<OrgUser[]> {
    console.log(`Fetching users for org: ${orgId}`);

    return [
      { id: 'user-1', email: 'user1@example.com' },
      { id: 'user-2', email: 'user2@example.com' }
    ];
  }
};
