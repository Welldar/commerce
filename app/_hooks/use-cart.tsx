'use client'
import {
  useContext,
  createContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
} from 'react'
import type {
  Cart,
  LineItemDraft,
  MyCartChangeLineItemQuantityAction,
} from '@commercetools/platform-sdk'
import { addItemAction, updateAction } from '../_actions/cart-actions'
import { debounce } from '../_utils/client-utility'

type cartContext = {
  cart: Cart | null
  isLoading: boolean
  addItemToCart: (lineItem: LineItemDraft) => Promise<void>
  updateQuantity: (lineItemId: string, quantity: number) => void
  setCart: Dispatch<SetStateAction<Cart | null>>
  updateCart: () => Promise<void>
}

async function fetchCart(): Promise<Cart | null> {
  return (await fetch('/api/me/cart')).json()
}

const CartContext = createContext<cartContext | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const addItemToCart = useCallback(async (lineItem: LineItemDraft) => {
    const cart = await addItemAction(lineItem)
    setCart(cart)
  }, [])

  const updateQuantity = useMemo(
    () =>
      debounce(async (lineItemId: string, quantity: number) => {
        const update: MyCartChangeLineItemQuantityAction = {
          action: 'changeLineItemQuantity',
          lineItemId,
          quantity,
        }
        console.log('quantity update')

        const cart = await updateAction(update)
        setCart(cart)
      }, 600),
    []
  )

  const updateCart = useCallback(async () => {
    const response = await fetchCart()

    setCart(response)
  }, [])

  useEffect(() => {
    let ignore = false

    async function getCart() {
      const response = await fetchCart()

      if (ignore) return

      setCart(response)
      setIsLoading(false)
    }

    getCart()

    return () => {
      ignore = true
    }
  }, [])

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        addItemToCart,
        updateQuantity,
        setCart,
        updateCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)

  if (!context) throw new Error('useCart has to be used within <CartProvider>')

  return context
}
