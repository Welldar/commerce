import type { Image as ImageType } from '@commercetools/platform-sdk'
import Image from 'next/image'
import styles from './gallery.module.css'
import React, { Dispatch, SetStateAction, useState } from 'react'

export function Gallery({
  images,
  displayedInd,
  wrapperClass,
  thumbnailsClass,
  mainImgClass,
  setDisplayedInd,
  onClick,
}: {
  images: ImageType[]
  displayedInd: number
  wrapperClass?: string
  thumbnailsClass?: string
  mainImgClass?: string
  setDisplayedInd: Dispatch<SetStateAction<number>>
  onClick?: React.ReactEventHandler
}) {
  const thumbnails = images.map((image, ind) => (
    <Image
      alt=""
      className={ind == displayedInd ? styles.active : ''}
      src={image.url}
      key={image.url}
      width={image.dimensions.w}
      height={image.dimensions.h}
      sizes="(max-width: 1920px) 150px"
      onClick={() => setDisplayedInd(ind)}
    />
  ))

  const img = images[displayedInd]

  return (
    <div className={`${styles.wrapper} ${wrapperClass || ''}`}>
      <Image
        priority={true}
        onClick={onClick}
        className={`${styles.image} ${mainImgClass || ''}`}
        alt=""
        src={img.url}
        width={img.dimensions.w}
        height={img.dimensions.h}
        sizes="(max-width: 1920px) 90vw"
      />
      <div className={`${styles.thumbnails} ${thumbnailsClass || ''}`}>
        {thumbnails}
      </div>
    </div>
  )
}
