'use client'
import {
  useContext,
  createContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react'
import type {
  Cart,
  LineItemDraft,
  MyCartChangeLineItemQuantityAction,
} from '@commercetools/platform-sdk'
import { addItemAction, updateAction } from '../_actions/cartActions'

type cartContext = {
  cart: Cart | null
  isLoading: boolean
  addItemToCart: (lineItem: LineItemDraft) => void
  updateQuantity: (lineItemId: string, quantity: number) => void
  setCart: Dispatch<SetStateAction<Cart | null>>
}

const CartContext = createContext<cartContext | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const addItemToCart = async (lineItem: LineItemDraft) => {
    const cart = await addItemAction(lineItem)
    setCart(cart)
  }

  const updateQuantity = async (lineItemId: string, quantity: number) => {
    const update: MyCartChangeLineItemQuantityAction = {
      action: 'changeLineItemQuantity',
      lineItemId,
      quantity,
    }
    const cart = await updateAction(update)
    setCart(cart)
  }

  useEffect(() => {
    let ignore = false

    const fetchCart = async () => {
      const response = await fetch('/api/me/cart')

      if (!ignore) {
        if (response.ok) setCart(await response.json())
        else {
          console.error(`${response.status} ${response.statusText}`)
          console.error(await response.json())
        }

        setIsLoading(false)
      }
    }

    fetchCart()

    return () => {
      ignore = true
    }
  }, [])

  return (
    <CartContext.Provider
      value={{ cart, isLoading, addItemToCart, updateQuantity, setCart }}
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
