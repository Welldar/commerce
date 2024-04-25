'use client';
import { useRouter } from 'next/navigation';
import { useContext, createContext, useState, useEffect } from 'react';
import { Cart, Customer } from '@commercetools/platform-sdk';
import { useCart } from './useCart';

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
  const { setCart } = useCart();
  const router = useRouter();

  const loginAction = async (data: FormData) => {
    try {
      const response = await fetch('/api/login/', {
        method: 'POST',
        body: data,
      });

      switch (response.status) {
        case 200:
          const { customer, cart } = (await response.json()) as {
            customer: Customer;
            cart: Cart | null;
          };
          setUser(customer);
          setCart(cart);
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

  const logOut = async () => {
    const response = await fetch('/api/logout');
    if (response.ok) {
      setUser(null);
      setCart(null);
      router.push('/');
    } else {
      console.error(response.statusText);
    }
  };

  useEffect(() => {
    let ignore = false;

    const fetchUser = async () => {
      const response = await fetch('/api/me');

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
