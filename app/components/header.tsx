'use client';
import './header.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './auth';
import { useQueryRouting } from './customHooks';
import { Suspense } from 'react';
import { formatPrice } from '../utility';
import svg from './cart.svg';
import Image from 'next/image';
import { useCart } from './useCart';

export default function Header() {
  return (
    <header className="header">
      <Suspense fallback={<h1>loading from header</h1>}>
        <HeaderInner></HeaderInner>
      </Suspense>
    </header>
  );
}

function SearchBar() {
  const { queryRouting, searchParams } = useQueryRouting();
  const defaultValue = searchParams.get('text.en-US') ?? '';

  return (
    <form
      className="search"
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

function HeaderInner() {
  const pathname = usePathname();

  const { logOut, user } = useAuth();
  const { cart } = useCart();

  return (
    <>
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
            className={`${pathname == '/login' ? 'active' : ''}`}
            href="/login"
          >
            Login
          </Link>
          <Link
            className={`${pathname == '/signup' ? 'active' : ''}`}
            href="/signup"
          >
            Signup
          </Link>
        </>
      )}
      <Link className={`${pathname == '/cart'}`} href="/cart">
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
    </>
  );
}
