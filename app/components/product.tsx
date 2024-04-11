import { ProductProjection } from '@commercetools/platform-sdk';
import styles from './product.module.css';
import Link from 'next/link';
import Carousel from './carousel';
import { BuyButton } from './BuyButton';

export function ProductCard({
  locale,
  product,
}: {
  locale: string;
  product: ProductProjection;
}) {
  const desc = product.description?.[locale] ?? '';
  const images = product.masterVariant.images;

  return (
    <>
      <Link href={`/product/${product.id}`}>
        <h3>{product.name[locale]}</h3>
      </Link>
      {images ? (
        <Carousel
          slides={images}
          className={styles.image + ' ' + 'keen-slider__slide'}
        ></Carousel>
      ) : null}
      <Link href={`/product/${product.id}`}>
        <div className={styles.desc}>{desc}</div>
      </Link>
      <BuyButton prices={product.masterVariant.prices}></BuyButton>
    </>
  );
}
