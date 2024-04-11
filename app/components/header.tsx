'use client';
import './header.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './auth';

export default function Header() {
  const pathname = usePathname();

  const { user, logOut, loading } = useAuth();

  const hidden = loading ? 'hidden' : '';

  return (
    <header className="header">
      <Link className={pathname == '/' ? 'active' : ''} href="/">
        Main
      </Link>
      {user ? (
        <>
          <Link
            className={pathname == '/profile' ? 'active' : ''}
            href="/profile"
          >
            {user.firstName ?? user.email}
          </Link>
          <Link href={pathname} onClick={logOut}>
            Logout
          </Link>
        </>
      ) : (
        <>
          <Link
            className={`${hidden} ${pathname == '/login' ? 'active' : ''}`}
            href="/login"
          >
            Login
          </Link>
          <Link
            className={`${hidden} ${pathname == '/signup' ? 'active' : ''}`}
            href="/signup"
          >
            Signup
          </Link>
        </>
      )}
    </header>
  );
}
