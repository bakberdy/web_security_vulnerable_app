import { useState } from 'react';
import { login as apiLogin, LoginData } from '../api/authApi';
import { User } from '@/entities/user';

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login(data: LoginData): Promise<User | null> {
    setIsLoading(true);
    setError(null);

    try {
      const user = await apiLogin(data);
      return user;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to login';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  return { login, isLoading, error };
}
