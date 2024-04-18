'use client';
import './header.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './auth';
import { useQueryRouting } from './customHooks';
import { useEffect, useRef } from 'react';

export default function Header() {
  const pathname = usePathname();

  const { user, logOut, loading } = useAuth();

  const hidden = loading ? 'hidden' : '';

  return (
    <header className="header">
      <SearchBar></SearchBar>
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

function SearchBar() {
  const ref = useRef<HTMLFormElement>(null);
  const { queryRouting, searchParams } = useQueryRouting();
  const defaultValue = searchParams.get('text.en-US') ?? '';

  useEffect(() => {
    if (ref.current) {
      ref.current.onformdata = e => console.log(e);
    }
  }, []);
  return (
    <form
      className="search"
      ref={ref}
      onSubmit={e => {
        const value =
          new FormData(e.currentTarget).get('text')?.toString() ?? '';
        e.preventDefault();
        queryRouting('text.en-US', value);
      }}
    >
      <input
        type="text"
        className="search--input"
        maxLength={256}
        placeholder="Search..."
        name="text"
        defaultValue={defaultValue}
      />
      <button type="submit" className="search--button">
        Find
      </button>
    </form>
  );
}
