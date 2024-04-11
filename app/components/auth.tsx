'use client';
import { useRouter } from 'next/navigation';
import { useContext, createContext, useState, useEffect } from 'react';
import { Customer, CustomerSignin } from '@commercetools/platform-sdk';

type authContext = {
  user: Customer | null;
  loginAction: (data: FormData) => Promise<boolean>;
  logOut: () => void;
};

const AuthContext = createContext<authContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loginAction = async (data: FormData) => {
    try {
      const response = await fetch('/login/api', {
        method: 'POST',
        body: data,
      });

      switch (response.status) {
        case 200:
          setUser(await response.json());
          return true;
          break;
        case 401:
          console.log(response.statusText);
          break;
      }
    } catch (err) {
      console.error(err);
    }

    return false;
  };

  const logOut = () => {
    setUser(null);
    router.push('/login');
  };

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch('./me');
      switch (response.status) {
        case 200:
          setUser(await response.json());
          break;
        case 401:
          console.log('not sign in');
          break;
        default:
          break;
      }
    };

    fetchUser();
  }, []);

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
