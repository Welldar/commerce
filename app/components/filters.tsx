'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

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
      <h2>Sort by</h2>
      <form>
        <label htmlFor="sort">
          <select
            name="sort"
            id="sort"
            onChange={e => {
              // setOptions({ sort: 'lastModifiedAt ' + e.target.value });
              router.push(
                pathname +
                  '?' +
                  createQueryString(
                    'sort',
                    encodeURI('name.en ' + e.target.value)
                  )
              );
            }}
          >
            <option value="default" defaultChecked>
              default
            </option>
            <option value="asc">lastModifiedAt asc</option>
            <option value="desc">lastModifiedAt desc</option>
          </select>
        </label>
      </form>
    </div>
  );
}
