'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './auth';

export default function Header() {
  const pathname = usePathname();
  const { user, logOut } = useAuth();
  return (
    <header>
      <Link className={pathname == '/' ? 'active' : ''} href="/">
        Main
      </Link>
      {user ? (
        <>
          <span>{user.email}</span>
          <button type="button" onClick={logOut}>
            Logout
          </button>
        </>
      ) : (
        <>
          <Link className={pathname == '/login' ? 'active' : ''} href="/login">
            Login
          </Link>
          <Link
            className={pathname == '/signup' ? 'active' : ''}
            href="/signup"
          >
            Signup
          </Link>
        </>
      )}
    </header>
  );
}
