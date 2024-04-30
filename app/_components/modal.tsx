import { createPortal } from 'react-dom';
import styles from './modal.module.css';

export function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: React.ReactEventHandler;
}) {
  const modal = (
    <div className={styles.bg}>
      <div className={styles.wrapper}>
        <span className={styles.close} onClick={onClose}>
          Close
        </span>
        {children}
      </div>
    </div>
  );
  return createPortal(modal, document.body);
}
