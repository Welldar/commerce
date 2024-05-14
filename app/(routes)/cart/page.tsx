import { getSession } from '@/app/_utils/server-utility'
import styles from './cart.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { getCart } from '@/app/_services/user'
import { LineItem } from '@commercetools/platform-sdk'
import { formatPrice } from '@/app/_utils/client-utility'
import { QuantityChanger } from '@/app/_components/quantity-changer/quantity-changer'
import { Attr } from '@/app/_components/attributes/attributes'

export default async function Page() {
  const { access_token, anonymous_token } = await getSession()
  const token = access_token ?? anonymous_token
  const cart = token ? await getCart(token) : null

  const empty = <h2 className={styles.h2}>You didnt buy anything</h2>

  return (
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
      <div className={styles.price}>
        <span>{formatPrice(product.totalPrice)}</span>{' '}
        <span className={styles.undiscounted}>
          {product.price.discounted
            ? formatPrice(totalUndiscountedPrice)
            : null}
        </span>
      </div>
      <div className={styles.quantity}>
        <QuantityChanger lineItemId={product.id} />
        <div>
          {formatPrice(product.price.discounted?.value ?? product.price.value)}{' '}
          for each
        </div>
      </div>
    </div>
  )
}
