'use client';
import './header.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './auth';

export default function Header() {
  const pathname = usePathname();

  const { user, logOut } = useAuth();
  return (
    <header className="header">
      <Link className={pathname == '/' ? 'active' : ''} href="/">
        Main
      </Link>
      {user ? (
        <>
          <Link href="/profile">{user.firstName ?? user.email}</Link>
          <Link href={pathname} onClick={logOut}>
            Logout
          </Link>
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
