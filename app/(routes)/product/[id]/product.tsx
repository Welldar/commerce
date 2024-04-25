'use client';
import { ProductProjection } from '@commercetools/platform-sdk';
import Carousel from '@/app/_components/carousel';
import styles from './product.module.css';
import { BuyButton } from '@/app/_components/BuyButton';
import Image from 'next/image';
import { notFound, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export function Product({ product }: { product: ProductProjection }) {
  const searchParams = useSearchParams();
  const variantId = searchParams.get('variantId') ?? '1';
  const [displayedId, setDesplayedId] = useState(+variantId);
  const locale = 'en-US';
  const variants = [product.masterVariant, ...product.variants];

  const variantsThumbnails = variants.map(({ id, images }) => {
    const img = images?.[0];

    return img ? (
      <Image
        key={id}
        onClick={() => {
          const newParams = new URLSearchParams(searchParams);

          newParams.set('variantId', `${id}`);

          window.history.replaceState(
            null,
            '',
            `${product.id}?${newParams.toString()}`
          );

          setDesplayedId(id);
        }}
        className={displayedId == id ? styles.highlighted : ''}
        src={img.url}
        alt=""
        width={img.dimensions.w}
        height={img.dimensions.h}
        sizes="10vw"
      />
    ) : (
      <div>No photo</div>
    );
  });

  const displayedVariant = variants.find(({ id }) => id == displayedId);

  if (!displayedVariant) return notFound();

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
        <BuyButton productId={product.id} productVariant={displayedVariant} />
      </div>
    </div>
  );
}
