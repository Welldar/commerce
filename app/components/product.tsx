'use client';
import { ProductProjection } from '@commercetools/platform-sdk';
import Carousel from './carousel';
import styles from './product.module.css';
import { BuyButton } from './BuyButton';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from './useCart';

export function Product({ product }: { product: ProductProjection }) {
  const [displayedInd, setDisplayedInd] = useState(0);
  const { addItemToCart, updateQuantity, cart } = useCart();
  const locale = 'en-US';

  const variants = [product.masterVariant, ...product.variants];

  const variantsThumbnails = variants
    .map(variant => variant.images?.[0])
    .map((img, i) =>
      img ? (
        <Image
          className={displayedInd == i ? styles.highlighted : ''}
          onClick={() => setDisplayedInd(i)}
          key={img.url}
          src={img.url}
          alt=""
          width={img.dimensions.w}
          height={img.dimensions.h}
          sizes="10vw"
        ></Image>
      ) : null
    );

  const displayedVariant = variants[displayedInd];

  const images = displayedVariant.images;
  const availableQuantity = displayedVariant.availability?.availableQuantity;

  const productSpec = (
    displayedVariant.attributes?.find(attr => attr.name == 'productspec')
      ?.value[locale] as string
  )
    ?.split('\n')
    .map(spec => <div key={spec}>{spec}</div>);

  const colorLabel = displayedVariant.attributes?.find(
    attr => attr.name == 'colorlabel'
  )?.value[locale];

  const productId = product.id;
  const variantId = displayedVariant.id;

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

        <div>{productSpec ? productSpec : null}</div>
        <div>{colorLabel ? 'Color: ' + colorLabel : null}</div>
        <div className={styles.variants}>{variantsThumbnails}</div>
      </div>
      <div className={styles.checkout}>
        <div>
          {availableQuantity ? 'Left in stock ' + availableQuantity : null}
        </div>
        <BuyButton
          price={displayedVariant.price!}
          onClick={() => addItemToCart({ productId, variantId })}
        ></BuyButton>
      </div>
    </div>
  );
}
