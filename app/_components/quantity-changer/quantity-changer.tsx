'use client'
import styles from './quantity-changer.module.css'
import { useCart } from '../../_hooks/use-cart'

export function QuantityChanger({
  quantity,
  lineItemId,
}: {
  quantity: number
  lineItemId: string
}) {
  const { updateQuantity } = useCart()
  return (
    <span className={styles.quantity}>
      <span
        className={styles.button}
        onClick={(e) => {
          e.stopPropagation()
          updateQuantity(lineItemId, quantity - 1)
        }}
      ></span>
      <span>{quantity}</span>
      <span
        className={styles.button}
        onClick={(e) => {
          e.stopPropagation()
          updateQuantity(lineItemId, quantity + 1)
        }}
      ></span>
    </span>
  )
}
