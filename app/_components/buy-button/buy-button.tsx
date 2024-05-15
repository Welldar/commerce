'use client'
import { ProductVariant } from '@commercetools/platform-sdk'
import { formatPrice } from '../../_utils/client-utility'
import styles from './buy.module.css'
import { useCart } from '../../_hooks/use-cart'
import { QuantityChanger } from '../quantity-changer/quantity-changer'
import { Spinner } from '../spinner/spinner'
import { useState } from 'react'
import { DiscountPrice } from '../discount-price/discount-price'

export function BuyButton({
  productVariant,
  productId,
}: {
  productVariant: ProductVariant
  productId: string
}) {
  const { addItemToCart, cart } = useCart()
  const [isPending, setIsPending] = useState(false)
  const price = productVariant.price

  if (!price) return <div>no price</div>

  const discounted = price.discounted
  const discountPrice = discounted
    ? formatPrice(price.discounted.value)
    : undefined
  const fullPrice = formatPrice(price.value)

  const variantInCart = cart?.lineItems.find(
    ({ variant, productId: id }) =>
      productId == id && variant.id == productVariant.id
  )

  const disabled = variantInCart !== undefined || isPending

  return (
    <button
      className={`${styles.buy} ${disabled ? styles.inCart : ''}`}
      onClick={
        disabled
          ? undefined
          : async () => {
              setIsPending(true)
              await addItemToCart({ productId, variantId: productVariant.id })
              setIsPending(false)
            }
      }
    >
      <span>
        <DiscountPrice fullPrice={fullPrice}>
          {discountPrice ? (
            <span className={styles.discount}>{discountPrice}</span>
          ) : null}
        </DiscountPrice>
      </span>
      <span>|</span>
      {variantInCart !== undefined ? (
        <QuantityChanger lineItem={variantInCart} />
      ) : isPending ? (
        <span>
          <Spinner />
        </span>
      ) : (
        <span>Add to cart</span>
      )}
    </button>
  )
}
