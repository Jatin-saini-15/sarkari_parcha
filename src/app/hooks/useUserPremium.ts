import { useSession } from 'next-auth/react';

interface User {
  id: string;
  email: string;
  name?: string;
  isPremium: boolean;
  premiumUntil?: string;
  role: string;
}

export function useUserPremium() {
  const { data: session, status } = useSession();

  const isLoading = status === 'loading';
  const isAuthenticated = !!session;
  
  const user = session?.user as User | undefined;
  
  const isPremium = user?.isPremium && (
    !user.premiumUntil || 
    new Date(user.premiumUntil) > new Date()
  );

  const isAdmin = user?.role === 'admin' || user?.role === 'owner';

  return {
    isLoading,
    isAuthenticated,
    isPremium,
    isAdmin,
    user,
    session
  };
} 