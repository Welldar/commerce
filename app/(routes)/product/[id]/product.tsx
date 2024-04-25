'use client';
import { ProductProjection } from '@commercetools/platform-sdk';
import Carousel from '@/app/_components/carousel';
import styles from './product.module.css';
import { BuyButton } from '@/app/_components/BuyButton';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '@/app/_hooks/useCart';

export function Product({ product }: { product: ProductProjection }) {
  const [displayedInd, setDisplayedInd] = useState(0);
  const { cart } = useCart();
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

  const color = displayedVariant.attributes?.find(attr => attr.name == 'color')
    ?.value[locale];

  const productId = product.id;
  const variantId = displayedVariant.id;

  const productInCart = cart?.lineItems.find(
    ({ productId: id }) => productId == id
  );

  const variantInCart = productInCart?.variant;

  const inCart = variantInCart?.id == variantId;

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

        <div className={styles.attr}>
          <div className={styles.productSpec}>
            {productSpec ? productSpec : null}
          </div>
          <div>
            {colorLabel ? (
              <>
                <span className={styles.colorLabel}>Color: {colorLabel}</span>
                {color ? (
                  <span
                    className={styles.color}
                    style={{ backgroundColor: color }}
                  ></span>
                ) : null}
              </>
            ) : null}
          </div>
        </div>
        <div className={styles.variants}>{variantsThumbnails}</div>
      </div>
      <div className={styles.checkout}>
        <div>
          {availableQuantity ? 'Left in stock ' + availableQuantity : null}
        </div>
        <BuyButton
          productId={productId}
          productVariant={displayedVariant}
        ></BuyButton>
      </div>
    </div>
  );
}
