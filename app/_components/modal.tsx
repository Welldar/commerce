import { createPortal } from 'react-dom'
import styles from './modal.module.css'
import { SyntheticEvent } from 'react'

export function Modal({
  children,
  onClose,
  fullscreen = false,
}: {
  children: React.ReactNode
  onClose: React.ReactEventHandler
  fullscreen?: boolean
}) {
  document.documentElement.classList.add('overflow-hidden')

  const onModalClose = (e: SyntheticEvent) => {
    document.documentElement.classList.remove('overflow-hidden')
    onClose(e)
  }

  const modal = (
    <div>
      <div className={styles.bg} onClick={onModalClose}></div>
      <div
        className={`${styles.wrapper} ${fullscreen ? styles.fullscreen : styles.centered}`}
      >
        <span className={styles.close} onClick={onModalClose}>
          Close
        </span>
        {children}
      </div>
    </div>
  )
  return createPortal(modal, document.body)
}
