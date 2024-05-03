import type { ProductVariant } from '@commercetools/platform-sdk'

export type ProductProjection = {
  name: string
  description: string | undefined
  id: string
  masterVariant: ProductVariant
}
