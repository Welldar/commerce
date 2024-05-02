import styles from './cart.module.css'
import Skeleton from '@/app/_components/skeleton'

export default function Loading() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.product}>
        <div className={styles.img}>
          <Skeleton style={{ height: '100%' }} />
        </div>
        <div className={styles.spec}>
          <h5 className={styles.h5}>
            <Skeleton />
          </h5>
          <div>
            <Skeleton count={2} />
          </div>
        </div>
        <div>
          <Skeleton />
        </div>
        <div>
          <Skeleton count={2} />
        </div>
      </div>
    </div>
  )
}
