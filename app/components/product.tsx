import { ProductData } from '@commercetools/platform-sdk';
import styles from './product.module.css';
import Image from 'next/image';
import Link from 'next/link';
import Carousel from './carousel';

export function ProductCard({
  locale,
  product,
}: {
  locale: string;
  product: ProductData;
}) {
  const desc = product.description?.[locale] ?? '';
  const images = product.masterVariant.images;
  return (
    <>
      <Link href={`/product/${product.slug[locale]}`}>
        <h3>{product.name[locale]}</h3>

        {/* <Image
        width={product.masterVariant.images?.[0].dimensions.w}
        height={product.masterVariant.images?.[0].dimensions.h}
        className={styles.image}
        src={product.masterVariant.images?.[0].url ?? ''}
        alt={desc}
      ></Image> */}
      </Link>
      {images ? (
        <Carousel
          slides={images}
          className={styles.image + ' ' + 'keen-slider__slide'}
        ></Carousel>
      ) : null}
      <Link href={`/product/${product.slug[locale]}`}>
        <div className={styles.desc}>{desc}</div>
      </Link>
    </>
  );
}
