import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { user, loading, loadUser } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, []);

  return { user, loading };
};
