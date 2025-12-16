import { apiClient } from '@/shared/api/client';
import type { User } from '@/entities/user';

export type RegisterData = {
  email: string;
  password: string;
}

export type LoginData = {
  email: string;
  password: string;
}

export async function register(data: RegisterData): Promise<User> {
  const response = await apiClient.post('/auth/register', data);
  return response.data;
}

export async function login(data: LoginData): Promise<User> {
  const response = await apiClient.post('/auth/login', data);
  return response.data;
}

export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout');
}

export async function getCurrentUser(): Promise<User> {
  const response = await apiClient.get('/users/me');
  return response.data;
}
