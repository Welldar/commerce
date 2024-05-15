'use client'
import { ProductVariant } from '@commercetools/platform-sdk'
import { formatPrice } from '../../_utils/client-utility'
import styles from './buy.module.css'
import { useCart } from '../../_hooks/use-cart'
import { QuantityChanger } from '../quantity-changer/quantity-changer'
import { Spinner } from '../spinner/spinner'
import { useState } from 'react'

export function BuyButton({
  productVariant,
  productId,
}: {
  productVariant: ProductVariant
  productId: string
}) {
  const { addItemToCart, cart } = useCart()
  const [isClicked, setIsClicked] = useState(false)
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

  const disabled = variantInCart !== undefined || isClicked

  return (
    <button
      className={`${styles.buy} ${disabled ? styles.inCart : ''}`}
      onClick={
        disabled
          ? undefined
          : async () => {
              setIsClicked(true)
              await addItemToCart({ productId, variantId: productVariant.id })
              setIsClicked(false)
            }
      }
    >
      <span>
        <span className={discounted ? styles.discount : ''}>
          {fullPrice}
          <span>{discounted ? `${discountPrice}` : null}</span>
        </span>
      </span>
      <span>|</span>
      {variantInCart !== undefined ? (
        <QuantityChanger lineItem={variantInCart} />
      ) : isClicked ? (
        <span>
          <Spinner />
        </span>
      ) : (
        <span>Add to cart</span>
      )}
    </button>
  )
}
