import styles from './discount-price.module.css'

export function DiscountPrice({
  fullPrice,
  children,
}: {
  fullPrice: string
  children?: React.ReactNode
}) {
  return (
    <span className={styles.discount}>
      {fullPrice}
      {children}
    </span>
  )
}
