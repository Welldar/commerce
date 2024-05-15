import styles from './quantity-changer.module.css'
import { useCart } from '../../_hooks/use-cart'
import type { LineItem } from '@commercetools/platform-sdk'
import { useState } from 'react'

export function QuantityChanger({ lineItem }: { lineItem: LineItem }) {
  const { updateQuantity } = useCart()
  const [quantity, setQuantity] = useState(lineItem.quantity)

  const changeQuantity = (summand: number) => {
    const newQuantity = quantity + summand

    if (newQuantity < 0) return

    console.log('quantity changed')

    setQuantity(newQuantity)
    updateQuantity(lineItem.id, newQuantity)
  }

  return (
    <span className={styles.quantity}>
      <span
        className={`${styles.button} ${quantity <= 0 ? styles.disabled : ''}`}
        onClick={() => changeQuantity(-1)}
      />
      <span>{quantity}</span>
      <span className={styles.button} onClick={() => changeQuantity(1)} />
    </span>
  )
}
