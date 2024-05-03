import { ProductProjection } from '@commercetools/platform-sdk'
import styles from './productCard.module.css'
import Link from 'next/link'
import { BuyButton } from './BuyButton'
import { ForwardedRef, forwardRef } from 'react'
import { Carousel } from './carousel'

export const ProductCard = forwardRef(Product)

function Product(
  {
    locale,
    product,
    asc,
  }: {
    locale: string
    product: ProductProjection
    asc: boolean | undefined
  },
  ref: ForwardedRef<any>
) {
  const desc = product.description?.[locale] ?? ''
  const productId = product.id

  const variants = [product.masterVariant, ...product.variants].filter(
    (variant) => variant.isMatchingVariant
  )

  if (asc != undefined)
    variants.sort(({ scopedPrice: p1 }, { scopedPrice: p2 }) => {
      if (asc) return p1!.currentValue.centAmount - p2!.currentValue.centAmount
      else return p2!.currentValue.centAmount - p1!.currentValue.centAmount
    })
  const displayedVariant = variants[0] ?? product.masterVariant
  const images = displayedVariant.images

  const href = `/product/${product.id}?variantId=${displayedVariant.id}`

  return (
    <>
      <Link ref={ref} href={href}>
        <h3>{product.name[locale]}</h3>
      </Link>
      {images ? <Carousel images={images} /> : <div>No photo</div>}
      <Link href={href} className={styles.desc}>
        {desc}
      </Link>
      <BuyButton
        productId={productId}
        productVariant={displayedVariant}
      ></BuyButton>
    </>
  )
}
