'use client'
import { useContext, createContext, useState, useEffect } from 'react'
import type { Customer } from '@commercetools/platform-sdk'
import { useCart } from './use-cart'
import { logoutAction, loginAction } from '../_actions/auth-actions'

type userData = Customer | null

type authContext = {
  user: userData
  login: (data: FormData) => Promise<string | undefined>
  logOut: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<authContext | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<userData>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { setCart } = useCart()

  const login = async (formData: FormData) => {
    const data = await loginAction(formData)

    if ('error' in data) {
      return data.error
    } else {
      setUser(data.customer)
      setCart(data.cart ?? null)
    }
  }

  const logOut = async () => {
    await logoutAction()
    setUser(null)
    setCart(null)
  }

  useEffect(() => {
    let ignore = false

    const fetchUser = async () => {
      const response = await fetch('/api/me')

      if (!ignore) {
        if (response.ok) setUser(await response.json())
        else console.error(await response.json())

        setIsLoading(false)
      }
    }

    fetchUser()

    return () => {
      ignore = true
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) throw new Error('useAuth has to be used within <AuthProvider>')

  return context
}
