'use client';
import './header.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './auth';
import { useQueryRouting } from './customHooks';
import { useEffect, useRef } from 'react';
import { formatPrice } from '../utility';
import svg from './cart.svg';
import Image from 'next/image';
import { useCart } from './useCart';

export default function Header() {
  const pathname = usePathname();

  const { logOut, loading, user } = useAuth();
  const { cart } = useCart();

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
      <Link className={`${hidden}  ${pathname == '/cart'}`} href="/cart">
        Cart
      </Link>
      <div className="cart">
        <Image
          className="cart-svg"
          src={svg.src}
          width={svg.width}
          height={svg.height}
          alt=""
        ></Image>
        <span className="amount">{cart?.totalLineItemQuantity ?? 0}</span>
        <span className="total-price">
          {cart?.totalPrice ? formatPrice(cart?.totalPrice) : 0}
        </span>
      </div>
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
