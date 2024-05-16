'use client'
import { createPortal } from 'react-dom'
import styles from './modal.module.css'
import { useLayoutEffect } from 'react'

export function Modal({
  children,
  onClose,
  fullscreen = false,
}: {
  children: React.ReactNode
  onClose: React.ReactEventHandler
  fullscreen?: boolean
}) {
  useLayoutEffect(() => {
    document.documentElement.classList.add('overflow-hidden')

    return () => document.documentElement.classList.remove('overflow-hidden')
  }, [])

  const modal = (
    <div>
      <div className={styles.bg} onClick={onClose}></div>
      <div
        className={`${styles.wrapper} ${fullscreen ? styles.fullscreen : styles.centered}`}
      >
        <span className={styles.close} onClick={onClose}>
          Close
        </span>
        {children}
      </div>
    </div>
  )
  return createPortal(modal, document.body)
}
