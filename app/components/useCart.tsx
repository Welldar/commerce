'use client';
import { useRouter } from 'next/navigation';
import { useContext, createContext, useState, useEffect } from 'react';
import {
  Cart,
  LineItemDraft,
  MyCartChangeLineItemQuantityAction,
} from '@commercetools/platform-sdk';

type cartContext = {
  cart: Cart | null;
  loading: boolean;
  addItemToCart: (lineItem: LineItemDraft) => void;
  updateQuantity: (lineItemId: string, quantity: number) => void;
};

const CartContext = createContext<cartContext | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const addItemToCart = async (lineItem: LineItemDraft) => {
    const response = await fetch('/me/cart', {
      method: 'POST',
      body: JSON.stringify(lineItem),
    });

    const cart = await response.json();

    response.ok ? setCart(cart) : console.log(cart);
  };

  const updateQuantity = async (lineItemId: string, quantity: number) => {
    const body: MyCartChangeLineItemQuantityAction = {
      action: 'changeLineItemQuantity',
      lineItemId,
      quantity,
    };

    const response = await fetch('/me/cart/update', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    const cart = await response.json();

    response.ok ? setCart(cart) : console.log(cart);
  };

  useEffect(() => {
    let ignore = false;

    const fetchCart = async () => {
      const response = await fetch('/me/cart');

      if (!ignore) {
        switch (response.status) {
          case 200:
            setCart(await response.json());
            break;
          case 401:
            console.log('no credentials');
            break;
          case 404:
            console.log('no cart');
            break;
          default:
            break;
        }

        setLoading(false);
      }
    };

    fetchCart();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <CartContext.Provider
      value={{ cart, loading, addItemToCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) throw new Error('useCart has to be used within <CartProvider>');
  return context;
};
