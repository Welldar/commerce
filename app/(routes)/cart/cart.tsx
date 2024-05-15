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
import { useEffect } from 'react'
import { DiscountPrice } from '@/app/_components/discount-price/discount-price'

export function Cart({ syncCart }: { syncCart: Cart | null }) {
  const { cart, isLoading, setCart } = useCart()

  const empty = <h2 className={styles.h2}>You didnt buy anything</h2>

  useEffect(() => setCart(syncCart), [setCart, syncCart])

  return isLoading ? (
    <Loading />
  ) : (
    <div className={styles.contentWrapper}>
      {
        <div className={styles.wrapper}>
          {cart
            ? cart.totalLineItemQuantity
              ? cart.lineItems.map((lineItem) => (
                  <ProductInCart key={lineItem.id} product={lineItem} />
                ))
              : empty
            : empty}
        </div>
      }
    </div>
  )
}

function ProductInCart({ product }: { product: LineItem }) {
  const locale = 'en-US'
  const variant = product.variant
  const img = variant.images?.[0]

  const totalUndiscountedPrice = { ...product.price.value }

  totalUndiscountedPrice.centAmount *= product.quantity

  const href = `/product/${product.productId}?variantId=${product.variant.id}`
  const fullPrice = product.price.discounted
    ? formatPrice(totalUndiscountedPrice)
    : null

  return (
    <div className={styles.product}>
      <Link href={href} className={styles.img}>
        <Image
          alt=""
          src={img?.url ?? ''}
          width={img?.dimensions.w}
          height={img?.dimensions.h}
          sizes="10vw"
        />
      </Link>
      <div className={styles.spec}>
        <Link href={href}>
          <h5 className={styles.h5}>{product.name[locale]}</h5>
        </Link>
        <Attr displayedVariant={variant} />
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
