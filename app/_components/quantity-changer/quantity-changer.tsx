'use client'
import styles from './quantity-changer.module.css'
import { useCart } from '../../_hooks/use-cart'
import Skeleton from '../skeleton'

export function QuantityChanger({ lineItemId }: { lineItemId: string }) {
  const { updateQuantity, cart, isLoading } = useCart()
  const lineItem = cart?.lineItems.find(({ id }) => id == lineItemId)

  if (isLoading) return <Skeleton />
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
