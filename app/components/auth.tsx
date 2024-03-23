'use client';
import { useRouter } from 'next/navigation';
import { useContext, createContext, useState } from 'react';
import { login } from '@/client';
import { Customer, CustomerSignin } from '@commercetools/platform-sdk';

type authContext = {
  user: Customer | null;
  loginAction: (data: CustomerSignin) => void;
  logOut: () => void;
};

export const AuthContext = createContext<authContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Customer | null>(null);
  const router = useRouter();

  const loginAction = async (data: CustomerSignin) => {
    try {
      const user = await login(data);

      if (!user) return console.log('no such a user');

      setUser(user.customer);
      router.push('/');
      return;
    } catch (err) {
      console.error(err);
    }
  };

  const logOut = () => {
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loginAction, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) throw new Error('useAuth has to be used within <AuthProvider>');
  return context;
};
