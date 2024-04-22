'use client';
import { LineItem } from '@commercetools/platform-sdk';
import { useCart } from './useCart';
import Image from 'next/image';
import styles from './cart.module.css';
import { formatPrice } from '../utility';

export function Cart() {
  const { cart } = useCart();

  const empty = <h4 className={styles.h4}>You didnt buy anything</h4>;

  return (
    <>
      {cart ? (
        cart.totalLineItemQuantity ? (
          <div className={styles.wrapper}>
            {cart.lineItems.map(lineItem => (
              <ProductInCart
                key={lineItem.id}
                product={lineItem}
              ></ProductInCart>
            ))}
          </div>
        ) : (
          empty
        )
      ) : (
        empty
      )}
    </>
  );
}

function ProductInCart({ product }: { product: LineItem }) {
  const { updateQuantity } = useCart();
  const locale = 'en-US';
  const variant = product.variant;
  const img = variant.images?.[0];

  const productSpec = variant.attributes?.find(
    attr => attr.name == 'productspec'
  )?.value[locale];
  const colorLabel = variant.attributes?.find(attr => attr.name == 'colorlabel')
    ?.value[locale];
  const totalUndiscountedPrice = { ...product.price.value };
  totalUndiscountedPrice.centAmount *= product.quantity;
  return (
    <div className={styles.product}>
      <div className={styles.img}>
        <Image
          alt=""
          src={img?.url ?? ''}
          width={img?.dimensions.w}
          height={img?.dimensions.h}
          sizes="10vw"
        ></Image>
      </div>
      <div className={styles.spec}>
        <h5 className={styles.h5}>{product.name[locale]}</h5>

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
        <div className={styles.quantity}>
          <button
            onClick={() => updateQuantity(product.id, product.quantity - 1)}
          >
            <span>-</span>
          </button>
          <span>{product.quantity}</span>
          <button
            onClick={() => updateQuantity(product.id, product.quantity + 1)}
          >
            <span>+</span>
          </button>
        </div>
        <div>
          {formatPrice(product.price.discounted?.value ?? product.price.value)}{' '}
          for each
        </div>
      </div>
    </div>
  );
}
