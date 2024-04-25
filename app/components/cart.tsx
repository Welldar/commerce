'use client';
import { LineItem } from '@commercetools/platform-sdk';
import { useCart } from './useCart';
import Image from 'next/image';
import styles from './cart.module.css';
import { formatPrice } from '../utility';
import { QuantityChanger } from './quantityChanger';
import Link from 'next/link';

export function Cart() {
  const { cart } = useCart();

  const empty = <h2 className={styles.h2}>You didnt buy anything</h2>;

  return (
    <>
      {
        <div className={styles.wrapper}>
          {cart
            ? cart.totalLineItemQuantity
              ? cart.lineItems.map(lineItem => (
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
  );
}

function ProductInCart({ product }: { product: LineItem }) {
  const locale = 'en-US';
  const variant = product.variant;
  const img = variant.images?.[0];

  const productSpec = (
    variant.attributes?.find(attr => attr.name == 'productspec')?.value[
      locale
    ] as string
  )
    ?.split('\n')
    .map((spec, i) => <div key={i}>{spec}</div>);
  const colorLabel = variant.attributes?.find(attr => attr.name == 'colorlabel')
    ?.value[locale];
  const totalUndiscountedPrice = { ...product.price.value };

  totalUndiscountedPrice.centAmount *= product.quantity;

  const href = `/product/${product.productId}?variantId=${product.variant.id}`;

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
        <div>{productSpec ? productSpec : null}</div>
        <div>{colorLabel ? 'color ' + colorLabel : null}</div>
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
  );
}
