import { createPortal } from 'react-dom'
import styles from './modal.module.css'

export function Modal({
  children,
  onClose,
  fullscreen = false,
  forwardUntouched = false,
}: {
  children: React.ReactNode
  onClose: React.ReactEventHandler
  fullscreen?: boolean
  forwardUntouched?: boolean
}) {
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
  return forwardUntouched ? (
    <div>
      <div></div>
      <div>
        <span></span>
        {children}
      </div>
    </div>
  ) : (
    createPortal(modal, document.body)
  )
}
