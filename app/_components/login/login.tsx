'use client'
import styles from './login.module.css'
import { useAuth } from '@/app/_hooks/use-auth'
import { useState } from 'react'

export function Login({ onLogin }: { onLogin: Function }) {
  const { login } = useAuth()
  const [error, setError] = useState<null | string>(null)

  return (
    <>
      <form
        className={styles.main}
        onSubmit={async (e) => {
          e.preventDefault()
          const form = new FormData(e.currentTarget)
          const error = await login(form)

          if (!error) {
            return onLogin()
          }

          setError(error)
        }}
      >
        <h1 className={styles.header}>Sign in</h1>
        <label htmlFor="password">Enter password</label>
        <input type="password" required id="password" name="password" />
        <label htmlFor="email">Enter email</label>
        <input type="email" required id="email" name="email" />
        {error}
        <div
          className={styles.devButton}
          onClick={() => {
            ;(
              document.querySelector(
                `.${styles.main} #password`
              ) as HTMLInputElement
            ).value = '5varfclo'
            ;(
              document.querySelector(
                `.${styles.main} #email`
              ) as HTMLInputElement
            ).value = 'seb@example.uk'
          }}
        >
          Sign in under dev acc
        </div>
        <button>Sign in</button>
      </form>
    </>
  )
}
