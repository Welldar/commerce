import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { createQueryString } from '../utility';

export function useQueryRouting() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const func = useCallback(
    (name: string, value: string) =>
      router.push(
        pathname + '?' + createQueryString(name, value, searchParams)
      ),
    [searchParams, pathname, router]
  );

  return func;
}
