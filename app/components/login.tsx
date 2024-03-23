'use client';
import { buildApiRoot } from '@/BuildClient';
import styles from './login.module.css';
import { login } from '@/client';
import { useRouter } from 'next/navigation';
import { useAuth } from './auth';

export default function Login({ isLogin = false }: { isLogin?: boolean }) {
  const router = useRouter();
  const { loginAction, user } = useAuth();

  if (user) router.push('/');
  return (
    <>
      <form
        onSubmit={async e => {
          e.preventDefault();
          const form = new FormData(e.currentTarget);
          const email = form.get('email')?.toString();
          const password = form.get('password')?.toString();

          if (!email || !password) return;

          loginAction({ email, password });

          const apiRootCustomer = buildApiRoot(password, email);

          // apiRootCustomer
          //   .me()
          //   .orders()
          //   .get()
          //   .execute()
          //   .then(({ body }) => console.log(body));

          router.push('/');
        }}
        className={styles.main}
      >
        <h1 className={styles.header}>{isLogin ? 'Войти' : 'Регистрация'}</h1>
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
        <button>{isLogin ? 'Войти' : 'Зарегистрироваться'}</button>
      </form>
    </>
  );
}
