'use client'
import { useState } from 'react'
import { Modal } from '../modal'
import filters from '@/app/_assets/filters.svg'
import Image from 'next/image'

export function FiltersMobile({
  children,
  className,
}: {
  children: React.ReactNode
  className: string
}) {
  const [showModal, setShowModal] = useState(false)

  return showModal ? (
    <Modal onClose={() => setShowModal(false)}>{children}</Modal>
  ) : (
    <div className={className} onClick={() => setShowModal(true)}>
      <Image
        src={filters.src}
        alt=""
        width={filters.width}
        height={filters.height}
      />
    </div>
  )
}
