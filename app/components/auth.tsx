'use client';
import { useRouter } from 'next/navigation';
import { useContext, createContext, useState, useEffect } from 'react';
import { Customer } from '@commercetools/platform-sdk';

type userData = Customer | null;

type authContext = {
  user: userData;
  loginAction: (data: FormData) => Promise<boolean>;
  logOut: () => void;
  loading: boolean;
};

const AuthContext = createContext<authContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<userData>(null);
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
    let ignore = false;

    const fetchUser = async () => {
      const response = await fetch('/me');

      if (!ignore) {
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

        setLoading(false);
      }
    };

    fetchUser();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loginAction, logOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) throw new Error('useAuth has to be used within <AuthProvider>');
  return context;
};
