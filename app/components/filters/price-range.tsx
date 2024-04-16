'use client';

import { shortFormatter } from '@/app/utility';
import { useQueryRouting } from '../customHooks';
import styles from './price-range.module.css';

export function PriceRange() {
  const queryRouting = useQueryRouting();

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

        queryRouting('price_range', `${from}:${to}`);
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
        <input id="from" type="text" name="from" inputMode="numeric" />
      </label>
      <label htmlFor="to" className={styles['price-input']}>
        <span>to</span>
        <input id="to" type="text" name="to" inputMode="numeric" />
      </label>
      <button type="submit" style={{ display: 'none' }}></button>
    </form>
  );
}
