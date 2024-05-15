'use client'
import styles from './quantity-changer.module.css'
import { useCart } from '../../_hooks/use-cart'

export function QuantityChanger({ lineItemId }: { lineItemId: string }) {
  const { updateQuantity, cart } = useCart()
  const lineItem = cart?.lineItems.find(({ id }) => id == lineItemId)

  if (!lineItem) return

  const quantity = lineItem.quantity

  return (
    <span className={styles.quantity}>
      <span
        className={styles.button}
        onClick={() => updateQuantity(lineItemId, quantity - 1)}
      />
      <span>{quantity}</span>
      <span
        className={styles.button}
        onClick={() => updateQuantity(lineItemId, quantity + 1)}
      />
    </span>
  )
}
