import { CentPrecisionMoney, TypedMoney } from '@commercetools/platform-sdk'
import { ReadonlyURLSearchParams } from 'next/navigation'

const formatter = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
})

export function formatPrice(price: TypedMoney | CentPrecisionMoney) {
  return formatter
    .format(price.centAmount / Math.pow(10, price.fractionDigits))
    .replace('.00', '')
}

export const shortFormatter = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  maximumFractionDigits: 0,
})

export const createQueryString = function (
  name: string,
  value: string,
  searchParams: ReadonlyURLSearchParams
) {
  const params = new URLSearchParams(searchParams.toString())
  params.set(name, value)

  return params.toString()
}

export const deleteQuery = function (
  name: string,
  searchParams: ReadonlyURLSearchParams
) {
  const params = new URLSearchParams(searchParams.toString())
  params.delete(name)

  return params.toString()
}

export const parseParams = function (
  searchParams: {
    [key: string]: string | string[] | undefined
  } = {}
) {
  const query = new URLSearchParams()

  for (let [q, value] of Object.entries(searchParams)) {
    if (Array.isArray(value)) {
      value.forEach((v) => query.append(q, v))
    } else query.append(q, value ?? '')
  }

  return query
}

export function debounce(func: Function, delay: number) {
  let timeoutId: ReturnType<typeof window.setTimeout>
  return function (...args: any[]) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      func(...args)
    }, delay)
  }
}
