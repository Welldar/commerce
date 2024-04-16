import styles from './sort.module.css';
import { useQueryRouting } from '../customHooks';

export function Sort() {
  const queryRouting = useQueryRouting();

  return (
    <>
      <h3>Sort by</h3>
      <label htmlFor="sort">
        <select
          className={styles.sort}
          id="sort"
          onChange={e => queryRouting('sort', e.target.value)}
        >
          <option value="lastModifiedAt desc" defaultChecked>
            newest
          </option>
          <option value="name.en-US asc">alphabetic asc</option>
          <option value="name.en-US  desc">alphabetic desc</option>
          <option value="variants.scopedPrice.currentValue.centAmount asc">
            price asc
          </option>
          <option value="variants.scopedPrice.currentValue.centAmount desc">
            price desc
          </option>
        </select>
      </label>
    </>
  );
}
