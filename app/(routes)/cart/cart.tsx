'use client'
import type { Cart, LineItem } from '@commercetools/platform-sdk'
import { useCart } from '@/app/_hooks/use-cart'
import Image from 'next/image'
import styles from './cart.module.css'
import { formatPrice } from '../../_utils/client-utility'
import { QuantityChanger } from '@/app/_components/quantity-changer/quantity-changer'
import Link from 'next/link'
import Loading from './loading'
import { Attr } from '@/app/_components/attributes/attributes'
import { useEffect, useState } from 'react'
import { DiscountPrice } from '@/app/_components/discount-price/discount-price'
import { useAuth } from '@/app/_hooks/use-auth'
import { Modal } from '@/app/_components/modal/modal'
import { Login } from '@/app/_components/login/login'

export function Cart({ syncCart }: { syncCart: Cart | null }) {
  const { cart, isLoading, setCart } = useCart()
  const { user, isLoading: userLoading } = useAuth()
  const [showModal, setShowModal] = useState(false)

  const empty = (
    <div className={styles.contentWrapper}>
      <h2 className={styles.h2}>You didnt buy anything</h2>
    </div>
  )

  useEffect(() => setCart(syncCart), [setCart, syncCart])

  if (isLoading) return <Loading />
  if (!cart || !cart.totalLineItemQuantity) return empty

  const cartFullPriceCentAmount = cart.lineItems
    .map((lineItem) => lineItem.price.value.centAmount * lineItem.quantity)
    .reduce((sum, price) => sum + price, 0)

  return (
    <div className={styles.contentWrapper}>
      <div className={styles.wrapper}>
        {cart.lineItems.map((lineItem) => (
          <ProductInCart key={lineItem.id} product={lineItem} />
        ))}
        <div className={styles.footer}>
          <div className={styles.totalPrice}>
            {formatPrice(cart.totalPrice)}{' '}
            <DiscountPrice
              fullPrice={formatPrice({
                ...cart.totalPrice,
                centAmount: cartFullPriceCentAmount,
              })}
            />
          </div>
          <div
            className={styles.checkout}
            onClick={() => {
              if (userLoading) return

              setShowModal(true)
            }}
          >
            Proceed to checkout
          </div>
          {showModal && (
            <Modal onClose={() => setShowModal(false)}>
              {user ? (
                <div>not implemented</div>
              ) : (
                <Login onLogin={() => setShowModal(false)} />
              )}
            </Modal>
          )}
        </div>
      </div>
    </div>
  )
}

function ProductInCart({ product }: { product: LineItem }) {
  const locale = 'en-US'
  const img = product.variant.images?.[0]
  const href = `/product/${product.productId}?variantId=${product.variant.id}`

  const fullPrice = product.price.discounted
    ? formatPrice({
        ...product.price.value,
        centAmount: product.price.value.centAmount * product.quantity,
      })
    : null

  return (
    <div className={styles.product}>
      <Link href={href} className={styles.img}>
        {img ? (
          <Image
            alt=""
            src={img.url}
            width={img.dimensions.w}
            height={img.dimensions.h}
            sizes="10vw"
          />
        ) : (
          <div>No photo</div>
        )}
      </Link>
      <div className={styles.spec}>
        <Link href={href}>
          <h5 className={styles.h5}>{product.name[locale]}</h5>
        </Link>
        <Attr displayedVariant={product.variant} />
      </div>
      <div className={styles.price}>
        <span>{formatPrice(product.totalPrice)}</span>{' '}
        {fullPrice ? <DiscountPrice fullPrice={fullPrice} /> : null}
      </div>
      <div className={styles.quantity}>
        <QuantityChanger lineItem={product} />
        <div>
          {formatPrice(product.price.discounted?.value ?? product.price.value)}{' '}
          for each
        </div>
      </div>
    </div>
  )
}
