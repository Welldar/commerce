import type { Image as ImageType } from '@commercetools/platform-sdk';
import Image from 'next/image';
import styles from './gallery.module.css';
import { useState } from 'react';

export function Gallery({ images }: { images: ImageType[] }) {
  const [displayedInd, setDesplayedInd] = useState(0);

  const thumbnails = images.map((image, ind) => (
    <Image
      alt=""
      className={ind == displayedInd ? styles.active : ''}
      src={image.url}
      key={image.url}
      width={image.dimensions.w}
      height={image.dimensions.h}
      sizes="(max-width: 1920px) 150px"
      onClick={() => setDesplayedInd(ind)}
    />
  ));

  const img = images[displayedInd];

  return (
    <div className={styles.wrapper}>
      <div className={styles.thumbnails}>{thumbnails}</div>

      <Image
        className={styles.image}
        alt=""
        src={img.url}
        width={img.dimensions.w}
        height={img.dimensions.h}
        sizes="(max-width: 1920px) 90vw"
      />
    </div>
  );
}
