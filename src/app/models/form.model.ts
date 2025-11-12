export interface Member {
  id: number;
  name: string;
  role: 'Admin' | 'User';
}

export interface AppSchema {
  name: string;
  description: string;
  tags: string[];
  settings: {
    notifications: boolean;
    theme: 'light' | 'dark' | 'system';
    refreshInterval: number;
  };
  members: Member[];
}
