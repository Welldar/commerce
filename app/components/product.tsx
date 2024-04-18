import { ProductProjection } from '@commercetools/platform-sdk';
import styles from './product.module.css';
import Link from 'next/link';
import Carousel from './carousel';
import { BuyButton } from './BuyButton';
import { ForwardedRef, forwardRef } from 'react';

export const ProductCard = forwardRef(Product);

function Product(
  {
    locale,
    product,
    asc,
  }: {
    locale: string;
    product: ProductProjection;
    asc: boolean | undefined;
  },
  ref: ForwardedRef<any>
) {
  const desc = product.description?.[locale] ?? '';

  const variants = [product.masterVariant, ...product.variants].filter(
    variant => variant.isMatchingVariant
  );

  if (asc != undefined)
    variants.sort(({ scopedPrice: p1 }, { scopedPrice: p2 }) => {
      if (asc) return p1!.currentValue.centAmount - p2!.currentValue.centAmount;
      else return p2!.currentValue.centAmount - p1!.currentValue.centAmount;
    });
  const displayedVariant = variants[0];
  const images = displayedVariant.images;

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
        price={displayedVariant.scopedPrice!}
        discounted={displayedVariant.scopedPriceDiscounted!}
      ></BuyButton>
    </>
  );
}
