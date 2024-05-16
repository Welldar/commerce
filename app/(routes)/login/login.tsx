'use client'
import styles from './login.module.css'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/app/_hooks/use-auth'
import { useState } from 'react'

export default function Login({ isLogin = false }: { isLogin?: boolean }) {
  const router = useRouter()
  const searchParams = useSearchParams()
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
            const redirect = searchParams.get('redirect') ?? '/'
            return router.replace(redirect)
          }

          setError(error)
        }}
        className={styles.main}
      >
        <h1 className={styles.header}>{isLogin ? 'Sign in' : 'Sign up'}</h1>
        {!isLogin ? (
          <>
            <label htmlFor="FName">Введите имя</label>
            <input type="text" id="FName" />
            <label htmlFor="LName">Введите фамилию</label>
            <input type="text" id="LName" />
          </>
        ) : null}
        <label htmlFor="password">Введите пароль</label>
        <input type="password" required id="password" name="password" />
        <label htmlFor="email">Введите email</label>
        <input type="email" required id="email" name="email" />
        <div>{error}</div>
        <button>{isLogin ? 'Войти' : 'Зарегистрироваться'}</button>
      </form>
    </>
  )
}
