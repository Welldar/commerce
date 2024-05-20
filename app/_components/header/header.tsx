'use client'
import styles from './header.module.css'
import Link from 'next/link'
import { ReadonlyURLSearchParams, usePathname } from 'next/navigation'
import { useAuth } from '../../_hooks/use-auth'
import { useQueryRouting } from '../../_hooks/use-query-routing'
import { Suspense, useState } from 'react'
import { formatPrice } from '../../_utils/client-utility'
import { useCart } from '../../_hooks/use-cart'
import { Modal } from '../modal/modal'
import { Spinner } from '../spinner/spinner'
import { Login } from '@/app/_components/login/login'
import Skeleton from '../skeleton'

export default function Header() {
  return (
    <header className={styles.header}>
      <Suspense fallback={null}>
        <HeaderInner />
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

  const { logOut, user, isLoading: userLoading } = useAuth()
  const { cart, isLoading: cartLoading } = useCart()

  return (
    <div className={styles.wrapper}>
      <SearchBar />
      <div className={styles.navigation}>
        <Link className={pathname == '/' ? styles.active : ''} href="/">
          Main
        </Link>
        {userLoading ? (
          <>
            <Skeleton />
            <Skeleton />
          </>
        ) : user ? (
          <>
            <span>{user.firstName ?? user.email}</span>
            <Logout logout={logOut} />
          </>
        ) : (
          <>
            <SignIn />
            <SignUp />
          </>
        )}

        <Link
          className={`${pathname == '/cart' && styles.active} ${styles.cart}`}
          href="/cart"
        >
          <div className={styles.cartIcon}>
            Cart
            <span className={styles.amount}>
              {cartLoading ? <Spinner /> : cart?.totalLineItemQuantity ?? 0}
            </span>
            <span className={styles.totalPrice}>
              {cartLoading ? (
                <Spinner />
              ) : cart?.totalPrice ? (
                formatPrice(cart.totalPrice).replace(/\.\d*/gi, '')
              ) : (
                '$0'
              )}
            </span>
          </div>
        </Link>
      </div>
    </div>
  )
}

function SignIn() {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <span className={styles.click} onClick={() => setShowModal(true)}>
        Sign in
      </span>
      {showModal ? (
        <Modal onClose={() => setShowModal(false)}>
          <Login onLogin={() => setShowModal(false)} />
        </Modal>
      ) : null}
    </>
  )
}

function SignUp() {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <span className={styles.click} onClick={() => setShowModal(true)}>
        Sign up
      </span>
      {showModal ? (
        <Modal onClose={() => setShowModal(false)}>
          <div>Not implemented</div>
        </Modal>
      ) : null}
    </>
  )
}

function Logout({ logout }: { logout: ReturnType<typeof useAuth>['logOut'] }) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <span className={styles.click} onClick={() => setShowModal(true)}>
        Logout
      </span>
      {showModal ? (
        <Modal onClose={() => setShowModal(false)}>
          <div className={styles.modal}>
            <div>Are you sure you wanna logout?</div>
            <span
              className={styles.click}
              onClick={async () => {
                await logout()
                setShowModal(false)
              }}
            >
              Logout
            </span>
          </div>
        </Modal>
      ) : null}
    </>
  )
}
