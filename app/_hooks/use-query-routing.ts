'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { createQueryString, deleteQuery } from '../_utils/client-utility'

export function useQueryRouting() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const queryRouting = useCallback(
    (
      name: string,
      value: string,
      path: string = pathname,
      params = searchParams
    ) => router.push(path + '?' + createQueryString(name, value, params)),
    [searchParams, pathname, router]
  )

  const deleteQ = useCallback(
    (name: string) =>
      router.push(pathname + '?' + deleteQuery(name, searchParams)),
    [router, searchParams, pathname]
  )

  return { queryRouting, searchParams, deleteQ, pathname }
}
