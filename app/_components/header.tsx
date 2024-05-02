'use client'
import styles from './header.module.css'
import Link from 'next/link'
import { ReadonlyURLSearchParams, usePathname } from 'next/navigation'
import { useAuth } from '../_hooks/useAuth'
import { useQueryRouting } from '../_hooks/useQueryRouting'
import { Suspense, useState } from 'react'
import { formatPrice } from '../_utils/utility'
import svg from '@/app/_assets/cart.svg'
import Image from 'next/image'
import { useCart } from '../_hooks/useCart'
import { Modal } from './modal'

export default function Header() {
  return (
    <header className={styles.header}>
      <Suspense fallback={<h1>loading from header</h1>}>
        <HeaderInner></HeaderInner>
      </Suspense>
    </header>
  )
}

function SearchBar() {
  const { queryRouting, searchParams, pathname } = useQueryRouting()
  const defaultValue = searchParams.get('text.en-US') ?? ''

  const searchable = pathname == '/' || pathname.includes('category')

  return (
    <form
      className={styles.search}
      onSubmit={(e) => {
        const value =
          new FormData(e.currentTarget).get('text')?.toString() ?? ''

        queryRouting(
          'text.en-US',
          value,
          searchable ? pathname : '/',
          searchable
            ? searchParams
            : new ReadonlyURLSearchParams(new URLSearchParams())
        )
        e.preventDefault()
      }}
    >
      <input
        type="text"
        className={styles.searchInput}
        maxLength={256}
        placeholder="Search..."
        name="text"
        defaultValue={defaultValue}
      />
      <button type="submit" className={styles.searchButton}>
        Find
      </button>
    </form>
  )
}

function HeaderInner() {
  const pathname = usePathname()

  const { logOut, user } = useAuth()
  const { cart } = useCart()

  return (
    <div className={styles.wrapper}>
      <SearchBar></SearchBar>
      <div className={styles.navigation}>
        <Link className={pathname == '/' ? styles.active : ''} href="/">
          Main
        </Link>
        {user ? (
          <>
            <span>{user.firstName ?? user.email}</span>
            <Logout logout={logOut} />
          </>
        ) : (
          <>
            <Link
              className={`${pathname == '/login' ? styles.active : ''}`}
              href="/login"
            >
              Login
            </Link>
            <Link
              className={`${pathname == '/signup' ? styles.active : ''}`}
              href="/signup"
            >
              Signup
            </Link>
          </>
        )}
        <Link
          className={`${pathname == '/cart' ? styles.active : ''} ${
            styles.cart
          }`}
          href="/cart"
        >
          Cart
          <div className={styles.cartIcon}>
            <Image
              className={styles.cartSvg}
              src={svg.src}
              width={svg.width}
              height={svg.height}
              alt=""
            ></Image>
            <span className={styles.amount}>
              {cart?.totalLineItemQuantity ?? 0}
            </span>
            <span className={styles.totalPrice}>
              {cart?.totalPrice
                ? formatPrice(cart?.totalPrice).slice(0, -3)
                : '$0'}
            </span>
          </div>
        </Link>
      </div>
    </div>
  )
}

function Logout({ logout }: { logout: React.ReactEventHandler }) {
  const [isOpened, setIsOpened] = useState(false)

  return (
    <>
      <span className={styles.click} onClick={() => setIsOpened(true)}>
        Logout
      </span>
      {isOpened ? (
        <Modal onClose={() => setIsOpened(false)}>
          <div className={styles.modal}>
            <div>Are you sure you wanna logout?</div>
            <span className={styles.click} onClick={logout}>
              Logout
            </span>
          </div>
        </Modal>
      ) : null}
    </>
  )
}
