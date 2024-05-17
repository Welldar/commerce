'use client'
import styles from './login.module.css'
import { useAuth } from '@/app/_hooks/use-auth'
import { useState } from 'react'

export function Login({
  onLogin,
  isLogin = false,
}: {
  onLogin: Function
  isLogin?: boolean
}) {
  const { login } = useAuth()
  const [error, setError] = useState<null | string>(null)

  return (
    <>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          const form = new FormData(e.currentTarget)

          const error = await login(form)

          if (!error) {
            return onLogin()
          }

          setError(error)
        }}
        className={styles.main}
      >
        <h1 className={styles.header}>{isLogin ? 'Sign in' : 'Sign up'}</h1>
        {!isLogin ? (
          <>
            <label htmlFor="FName">First Name</label>
            <input type="text" id="FName" />
            <label htmlFor="LName">Last Name</label>
            <input type="text" id="LName" />
          </>
        ) : null}
        <label htmlFor="password">Enter password</label>
        <input type="password" required id="password" name="password" />
        <label htmlFor="email">Enter email</label>
        <input type="email" required id="email" name="email" />
        <div>{error}</div>
        <button>{isLogin ? 'Sign in' : 'Sign up'}</button>
      </form>
    </>
  )
}
