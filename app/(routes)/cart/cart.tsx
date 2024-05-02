'use client'
import { LineItem } from '@commercetools/platform-sdk'
import { useCart } from '@/app/_hooks/useCart'
import Image from 'next/image'
import styles from './cart.module.css'
import { formatPrice } from '../../_utils/utility'
import { QuantityChanger } from '@/app/_components/quantityChanger'
import Link from 'next/link'
import Loading from './loading'
import { Attr } from '@/app/_components/attributes'

export function Cart() {
  const { cart, isLoading } = useCart()

  const empty = <h2 className={styles.h2}>You didnt buy anything</h2>

  return isLoading ? (
    <Loading />
  ) : (
    <>
      {
        <div className={styles.wrapper}>
          {cart
            ? cart.totalLineItemQuantity
              ? cart.lineItems.map((lineItem) => (
                  <ProductInCart
                    key={lineItem.id}
                    product={lineItem}
                  ></ProductInCart>
                ))
              : empty
            : empty}
        </div>
      }
    </>
  )
}

function ProductInCart({ product }: { product: LineItem }) {
  const locale = 'en-US'
  const variant = product.variant
  const img = variant.images?.[0]

  const totalUndiscountedPrice = { ...product.price.value }

  totalUndiscountedPrice.centAmount *= product.quantity

  const href = `/product/${product.productId}?variantId=${product.variant.id}`

  return (
    <div className={styles.product}>
      <Link href={href} className={styles.img}>
        <Image
          alt=""
          src={img?.url ?? ''}
          width={img?.dimensions.w}
          height={img?.dimensions.h}
          sizes="10vw"
        ></Image>
      </Link>
      <div className={styles.spec}>
        <Link href={href}>
          <h5 className={styles.h5}>{product.name[locale]}</h5>
        </Link>
        <Attr displayedVariant={variant} />
      </div>
      <div>
        <span>{formatPrice(product.totalPrice)}</span>{' '}
        <span className={styles.undiscounted}>
          {product.price.discounted
            ? formatPrice(totalUndiscountedPrice)
            : null}
        </span>
      </div>
      <div>
        <QuantityChanger quantity={product.quantity} lineItemId={product.id} />
        <div>
          {formatPrice(product.price.discounted?.value ?? product.price.value)}{' '}
          for each
        </div>
      </div>
    </div>
  )
}
