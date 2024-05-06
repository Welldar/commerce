import { Product } from './product'
import { getProduct as productById } from '@/app/_services/storefront'
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: { id: string } }) {
  const product = await productById(params.id)

  return product ? <Product product={product}></Product> : notFound()
}
