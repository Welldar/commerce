'use client'
import {
  Image as ImageType,
  ProductProjection,
} from '@commercetools/platform-sdk'
import styles from './product.module.css'
import { BuyButton } from '@/app/_components/buy-button/buy-button'
import Image from 'next/image'
import { notFound, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Attr } from '@/app/_components/attributes/attributes'
import { Modal } from '@/app/_components/modal/modal'
import { Gallery } from '@/app/_components/gallery/gallery'

export function Product({ product }: { product: ProductProjection }) {
  const searchParams = useSearchParams()
  const variantId = searchParams.get('variantId') ?? '1'
  const [displayedId, setDesplayedId] = useState(+variantId)
  const locale = 'en-US'
  const variants = [product.masterVariant, ...product.variants]

  const variantsThumbnails = variants.map(({ id, images }) => {
    const img = images?.[0]

    return img ? (
      <Image
        key={id}
        onClick={() => {
          const newParams = new URLSearchParams(searchParams)

          newParams.set('variantId', `${id}`)

          window.history.replaceState(
            null,
            '',
            `${product.id}?${newParams.toString()}`
          )

          setDesplayedId(id)
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
    )
  })

  const displayedVariant = variants.find(({ id }) => id == displayedId)

  if (!displayedVariant) return notFound()

  const images = displayedVariant.images
  const availableQuantity = displayedVariant.availability?.availableQuantity

  return (
    <div className={styles.wrapper}>
      {images ? <CarouselWrapper images={images} /> : null}
      <div className={styles.text}>
        <h2>{product.name[locale]}</h2>
        <div>{product.description?.[locale]}</div>
        <Attr displayedVariant={displayedVariant} />
        <div className={styles.variants}>{variantsThumbnails}</div>
      </div>
      <div className={styles.checkout}>
        <div>
          {availableQuantity ? 'Left in stock ' + availableQuantity : null}
        </div>
        <BuyButton productId={product.id} productVariant={displayedVariant} />
      </div>
    </div>
  )
}

function CarouselWrapper({ images }: { images: ImageType[] }) {
  const [showModal, setShowModal] = useState(false)
  const [dislayedInd, setDesplayedInd] = useState(0)

  return (
    <>
      {showModal && (
        <Modal fullscreen={true} onClose={() => setShowModal(false)}>
          <Gallery
            displayedInd={dislayedInd}
            setDisplayedInd={setDesplayedInd}
            images={images}
          />
        </Modal>
      )}

      <Gallery
        displayedInd={dislayedInd}
        setDisplayedInd={setDesplayedInd}
        images={images}
        wrapperClass={styles.galleryWrapper}
        mainImgClass={styles.galleryMainImg}
        thumbnailsClass={styles.galleryThumbnails}
        onClick={() => setShowModal(true)}
      />
    </>
  )
}
