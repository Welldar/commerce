'use client';
import { ProductProjection } from '@commercetools/platform-sdk';
import Carousel from './carousel';
import styles from './product.module.css';
import { BuyButton } from './BuyButton';

export function Product({ product }: { product: ProductProjection }) {
  const locale = 'en-US';
  const images = product.masterVariant.images;
  const availableQuantity =
    product.masterVariant.availability?.availableQuantity;

  const productSpec = product.masterVariant.attributes?.find(
    attr => attr.name == 'productspec'
  )?.value[locale];
  const colorLabel = product.masterVariant.attributes?.find(
    attr => attr.name == 'colorlabel'
  )?.value[locale];

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
        <div>
          {availableQuantity ? 'Amount left ' + availableQuantity : null}
        </div>
        <div>{productSpec ? productSpec : null}</div>
        <div>{colorLabel ? 'color ' + colorLabel : null}</div>
        <div>Buy</div>
        <BuyButton price={product.masterVariant.price!}></BuyButton>
      </div>
    </div>
  );
}
