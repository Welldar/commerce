import { Image as ImageType } from '@commercetools/platform-sdk'
import Image from 'next/image'
import { useState } from 'react'
import styles from './carousel.module.css'

export function Carousel({ images }: { images: ImageType[] }) {
  const [displayedInd, setDisplayedInd] = useState(0)

  const Img = images[displayedInd]
  const hoveredDivs = images.map((img, ind, arr) => (
    <div
      key={ind}
      className={displayedInd == ind ? styles.active : ''}
      onPointerOver={arr.length == 1 ? undefined : () => setDisplayedInd(ind)}
    ></div>
  ))

  return (
    <div className={styles.wrapper}>
      <div className={styles.carousel}>
        <Image
          alt=""
          src={Img.url}
          width={Img.dimensions.w}
          height={Img.dimensions.h}
          sizes="(max-width: 1920px) 300px"
        />

        <div className={styles.hoveredDivs}>{hoveredDivs}</div>
      </div>

      <div className={styles.dots}>{hoveredDivs}</div>
    </div>
  )
}
