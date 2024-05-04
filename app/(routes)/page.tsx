import { products } from '@/app/_services/commerce'
import Main from '@/app/_components/main'
import { parseParams } from '@/app/_utils/utility'

export const revalidate = 0

export default async function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const query = parseParams(searchParams)

  const productsResponse = await products({ queryArgs: query })

  return (
    <Main slug="" products={productsResponse} searchParams={query.toString()} />
  )
}
