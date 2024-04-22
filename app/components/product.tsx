import { ProductProjection } from '@commercetools/platform-sdk';
import Carousel from './carousel';
import styles from './product.module.css';

export function Product({ product }: { product: ProductProjection }) {
  const locale = 'en-US';
  const images = product.masterVariant.images;
  return (
    <div className={styles.wrapper}>
      <div className={styles.carousel}>
        {images ? (
          <Carousel
            className={styles.image + ' ' + 'keen-slider__slide'}
            sizes="50vw"
            slides={images}
          ></Carousel>
        ) : null}
      </div>
      <div>
        <h2>{product.name[locale]}</h2>
        <div>{product.description?.[locale]}</div>
      </div>
    </div>
  );
}
