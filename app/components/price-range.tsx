'use client';

import styles from './price-range.module.css';
import { createQueryString, shortFormatter } from '../utility';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function PriceRange() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  return (
    <form
      className={styles['price-range']}
      onBlur={e => {
        console.log(e);
      }}
      onSubmit={e => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const from =
          formData.get('from')?.toString().replaceAll(',', '') ?? '*';
        const to = formData.get('to')?.toString().replaceAll(',', '') ?? '*';

        const query = createQueryString(
          'price_range',
          `${from}:${to}`,
          searchParams
        );
        router.push(pathname + '?' + query);
      }}
      onInput={e => {
        if (e.target instanceof HTMLInputElement) {
          const value = Number(e.target.value.replaceAll(',', ''));

          if (Number.isNaN(value)) return;

          e.target.value = shortFormatter.format(value);
        }
      }}
    >
      <label htmlFor="from" className={styles['price-input']}>
        <span>from</span>
        <input id="from" type="text" name="from" />
      </label>
      <label htmlFor="to" className={styles['price-input']}>
        <span>to</span>
        <input id="to" type="text" name="to" />
      </label>
      <button type="submit" style={{ display: 'none' }}></button>
    </form>
  );
}
