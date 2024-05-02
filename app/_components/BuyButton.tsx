'use client'
import { ProductVariant } from '@commercetools/platform-sdk'
import { formatPrice } from '../_utils/utility'
import './buy.css'
import { useCart } from '../_hooks/useCart'
import { QuantityChanger } from './quantityChanger'

export function BuyButton({
  productVariant,
  productId,
}: {
  productVariant: ProductVariant
  productId: string
}) {
  const { addItemToCart, cart } = useCart()
  const price = productVariant.price

  if (!price) return <div>no price</div>

  const discounted = price.discounted
  const discountPrice = discounted
    ? formatPrice(price.discounted.value)
    : undefined
  const fullPrice = formatPrice(price.value)

  const productInCart = cart?.lineItems.find(
    ({ productId: id }) => productId == id
  )

  const variantInCart = productInCart?.variant

  const inCart = variantInCart?.id == productVariant.id

  return (
    <button
      className={`buy ${inCart ? 'inCart' : ''}`}
      onClick={() =>
        inCart
          ? undefined
          : addItemToCart({ productId, variantId: productVariant.id })
      }
    >
      <span>
        <span className={discounted ? 'discount' : ''}>
          {fullPrice}
          <span>{discounted ? `${discountPrice}` : null}</span>
        </span>
      </span>
      <span>|</span>
      {inCart ? (
        <QuantityChanger
          lineItemId={productInCart?.id!}
          quantity={productInCart?.quantity!}
        ></QuantityChanger>
      ) : (
        <span>Add to cart</span>
      )}
    </button>
  )
}
