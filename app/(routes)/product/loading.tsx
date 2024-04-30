import Skeleton from '@/app/_components/skeleton';
import styles from './[id]/product.module.css';

export default function Loading() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.carousel}>
        <Skeleton style={{ height: '300px' }} />
      </div>
      <div>
        <h2>
          <Skeleton />
        </h2>
        <div>
          <Skeleton count={5} />
        </div>

        <div className={styles.attr}>
          <div className={styles.productSpec} style={{ minWidth: '100px' }}>
            <Skeleton count={2} />
          </div>
          <div style={{ minWidth: '100px' }}>
            <Skeleton />
          </div>
        </div>
        <div className={styles.variants}>
          <Skeleton style={{ width: 150, height: 150 }} />
          <Skeleton style={{ width: 150, height: 150 }} />
        </div>
      </div>
      <div className={styles.checkout}>
        <div>
          <Skeleton />
        </div>
        <Skeleton />
      </div>
    </div>
  );
}
