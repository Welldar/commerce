'use client';

import { shortFormatter } from '@/app/utility';
import { useQueryRouting } from '../customHooks';
import styles from './price-range.module.css';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

export function PriceRange() {
  const queryRouting = useQueryRouting();

  const makeQueryValue = (form: HTMLFormElement) => {
    const formData = new FormData(form);
    const parseInput = (field: 'from' | 'to') => {
      const value = formData.get(field)!.toString().replaceAll(',', '');

      return +value ? value.concat('00') : '*';
    };
    const from = parseInput('from');
    const to = parseInput('to');

    return { from, to };
  };

  return (
    <form
      className={styles['price-range']}
      onBlur={e => {}}
      onSubmit={e => {
        e.preventDefault();

        const { from, to } = makeQueryValue(e.target as HTMLFormElement);

        queryRouting('price_range', `${from}:${to}`);
      }}
    >
      <PriceInput field="from"></PriceInput>
      <PriceInput field="to"></PriceInput>
      <button type="submit" style={{ display: 'none' }}></button>
    </form>
  );
}

function PriceInput({ field }: { field: string }) {
  const [value, setValue] = useState('');
  const [caretPos, setCaretPos] = useState(0);
  const [trigger, setTrigger] = useState(true);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    ref.current.selectionStart = ref.current.selectionEnd = caretPos;
  }, [caretPos, trigger]);
  return (
    <label htmlFor={field} className={styles['price-input']}>
      <span>{field}</span>
      <input
        ref={ref}
        id={field}
        type="text"
        name={field}
        inputMode="numeric"
        maxLength={9}
        value={value}
        onChange={e => {
          e.preventDefault();
          const regex = new RegExp(/[^\d,]+/g);
          const caretPos = e.target.selectionStart ?? 0;

          setCaretPos(caretPos - 1);
          if (regex.test(e.target.value)) {
            setTrigger(!trigger);
            return;
          }

          const valueNum = +e.target.value.replaceAll(',', '');
          const length = e.target.value.length;

          if (Number.isNaN(valueNum)) {
            return;
          }

          const newValue = shortFormatter.format(valueNum);

          setValue(newValue == '0' ? '' : newValue);
          setCaretPos(caretPos + newValue.length - length);
        }}
      />
    </label>
  );
}
