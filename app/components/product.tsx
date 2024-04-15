import { ProductProjection } from '@commercetools/platform-sdk';
import styles from './product.module.css';
import Link from 'next/link';
import Carousel from './carousel';
import { BuyButton } from './BuyButton';
import { ForwardedRef, Ref, RefObject, forwardRef } from 'react';

export const ProductCard = forwardRef(Product);

function Product(
  {
    locale,
    product,
  }: {
    locale: string;
    product: ProductProjection;
  },
  ref: ForwardedRef<any>
) {
  const desc = product.description?.[locale] ?? '';
  const images = product.masterVariant.images;

  return (
    <>
      <Link ref={ref} href={`/product/${product.id}`}>
        <h3>{product.name[locale]}</h3>
      </Link>
      {images ? (
        <Carousel
          sizes="(max-width: 768px) 50vw, 25vw"
          slides={images}
          className={styles.image + ' ' + 'keen-slider__slide'}
        ></Carousel>
      ) : null}
      <Link href={`/product/${product.id}`}>
        <div className={styles.desc}>{desc}</div>
      </Link>
      <BuyButton
        price={product.masterVariant.scopedPrice!}
        discounted={product.masterVariant.scopedPriceDiscounted!}
      ></BuyButton>
    </>
  );
}
