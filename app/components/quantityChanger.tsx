'use client';
import styles from './quantityChanger.module.css';
import { useCart } from './useCart';

export function QuantityChanger({
  quantity,
  lineItemId,
}: {
  quantity: number;
  lineItemId: string;
}) {
  const { updateQuantity } = useCart();
  return (
    <span className={styles.quantity}>
      <span
        className={styles.button}
        onClick={e => {
          e.stopPropagation();
          updateQuantity(lineItemId, quantity - 1);
        }}
      ></span>
      <span>{quantity}</span>
      <span
        className={styles.button}
        onClick={e => {
          e.stopPropagation();
          updateQuantity(lineItemId, quantity + 1);
        }}
      ></span>
    </span>
  );
}
