import { ProductProjection } from '../_services/interfaces'
import styles from './productCard.module.css'
import Link from 'next/link'
import { BuyButton } from './BuyButton'
import { ForwardedRef, forwardRef, memo } from 'react'
import { Carousel } from './carousel'
import Skeleton from 'react-loading-skeleton'

export const ProductCard = memo(forwardRef(Product), (prevProp, nextProps) =>
  prevProp.product && nextProps.product
    ? prevProp.product.id == nextProps.product.id
    : true
)

function Product(
  {
    product,
  }: {
    product?: ProductProjection
  },
  ref: ForwardedRef<any>
) {
  if (!product)
    return (
      <>
        <Link href="">
          <Skeleton />
        </Link>
        <Skeleton style={{ height: '100%' }} />
        <Link href="">
          <Skeleton className={styles.desc} count={2} />
        </Link>
        <Skeleton />
      </>
    )
  const desc = product.description ?? ''

  const displayedVariant = product.masterVariant
  const images = displayedVariant.images

  const href = `/product/${product.id}?variantId=${displayedVariant.id}`

  return (
    <>
      <Link ref={ref} href={href}>
        <h3>{product.name}</h3>
      </Link>
      {images ? <Carousel images={images} /> : <div>No photo</div>}
      <Link href={href} className={styles.desc}>
        {desc}
      </Link>
      <BuyButton productId={product.id} productVariant={displayedVariant} />
    </>
  )
}
