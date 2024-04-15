'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import styles from './filters.module.css';

export function Filters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  return (
    <div>
      <h3 className={styles.h3}>Sort by</h3>
      <label htmlFor="sort">
        <select
          className={styles.sort}
          id="sort"
          onChange={e => {
            router.push(
              pathname + '?' + createQueryString('sort', e.target.value)
            );
          }}
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
      <h3 className={styles.h3}>Filter by</h3>
    </div>
  );
}
