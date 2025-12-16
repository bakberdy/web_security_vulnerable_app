import { useState } from 'react';
import { register as apiRegister } from '../api/authApi';
import type { RegisterData } from '../api/authApi';
import type { User } from '@/entities/user';

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function register(data: RegisterData): Promise<User | null> {
    setIsLoading(true);
    setError(null);

    try {
      const user = await apiRegister(data);
      return user;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to register';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  return { register, isLoading, error };
}
