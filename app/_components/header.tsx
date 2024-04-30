'use client';
import './header.css';
import Link from 'next/link';
import { ReadonlyURLSearchParams, usePathname } from 'next/navigation';
import { useAuth } from '../_hooks/useAuth';
import { useQueryRouting } from '../_hooks/useQueryRouting';
import { Suspense } from 'react';
import { formatPrice } from '../_utils/utility';
import svg from '@/app/_assets/cart.svg';
import Image from 'next/image';
import { useCart } from '../_hooks/useCart';

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
  const { queryRouting, searchParams, pathname } = useQueryRouting();
  const defaultValue = searchParams.get('text.en-US') ?? '';

  const searchable = pathname == '/' || pathname.includes('category');

  return (
    <form
      className="search"
      onSubmit={e => {
        const value =
          new FormData(e.currentTarget).get('text')?.toString() ?? '';

        queryRouting(
          'text.en-US',
          value,
          searchable ? pathname : '/',
          searchable
            ? searchParams
            : new ReadonlyURLSearchParams(new URLSearchParams())
        );
        e.preventDefault();
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
      <Link
        className={`${pathname == '/cart' ? 'active' : ''} cart`}
        href="/cart"
      >
        Cart
        <div className="cart-icon">
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
      </Link>
    </>
  );
}
