export interface User {
  id: number;
  email: string;
  role: 'user' | 'admin';
  created_at: string;
}
