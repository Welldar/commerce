'use client'
import { ProductVariant } from '@commercetools/platform-sdk'
import { formatPrice } from '../../_utils/client-utility'
import styles from './buy.module.css'
import { useCart } from '../../_hooks/use-cart'
import { QuantityChanger } from '../quantity-changer/quantity-changer'
import { Spinner } from '../spinner/spinner'

export function BuyButton({
  productVariant,
  productId,
}: {
  productVariant: ProductVariant
  productId: string
}) {
  const { addItemToCart, cart, isLoading } = useCart()
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

  return (
    <button
      className={`${styles.buy} ${variantInCart !== undefined ? styles.inCart : ''}`}
      onClick={
        variantInCart !== undefined
          ? undefined
          : () => addItemToCart({ productId, variantId: productVariant.id })
      }
    >
      <span>
        <span className={discounted ? styles.discount : ''}>
          {fullPrice}
          <span>{discounted ? `${discountPrice}` : null}</span>
        </span>
      </span>
      <span>{isLoading ? <Spinner /> : '|'}</span>
      {variantInCart !== undefined ? (
        <QuantityChanger lineItem={variantInCart} />
      ) : (
        <span>Add to cart</span>
      )}
    </button>
  )
}
