'use client'
import styles from './sort.module.css'
import { useQueryRouting } from '../../_hooks/use-query-routing'

export function Sort() {
  const { queryRouting, searchParams } = useQueryRouting()

  const options = [
    { name: 'new', value: 'lastModifiedAt desc' },
    { name: 'alphabetic asc', value: 'name.en-US asc' },
    { name: 'alphabetic desc', value: 'name.en-US  desc' },
    {
      name: 'price asc',
      value: 'variants.scopedPrice.currentValue.centAmount asc',
    },
    {
      name: 'price desc',
      value: 'variants.scopedPrice.currentValue.centAmount desc',
    },
  ]
  const selected = searchParams.get('sort') ?? options[0].value

  return (
    <>
      <label htmlFor="sort">
        <select
          className={styles.sort}
          id="sort"
          onChange={(e) => queryRouting('sort', e.target.value)}
          defaultValue={selected}
        >
          {options.map(({ name, value }) => (
            <option value={value} key={name}>
              {name}
            </option>
          ))}
        </select>
      </label>
    </>
  )
}
