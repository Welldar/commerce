import { ProductData } from '@commercetools/platform-sdk';
import styles from './product.module.css';
import Image from 'next/image';

export function ProductCard({
  locale,
  product,
}: {
  locale: string;
  product: ProductData;
}) {
  const desc = product.description?.[locale] ?? '';
  return (
    <>
      <h3>{product.name[locale]}</h3>
      <img
        className={styles.image}
        src={product.masterVariant.images?.[0].url ?? ''}
        alt={desc}
      ></img>
      <div className={styles.desc}>{desc}</div>
    </>
  );
}
