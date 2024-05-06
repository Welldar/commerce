import Main from '@/app/_components/main'
import { category } from '@/app/_services/storefront'
import { notFound } from 'next/navigation'

export const revalidate = 0

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const categories = await category()
  const id = categories.results.find((c) => c.slug['en-US'] == params.slug)?.id

  if (!id) return notFound()

  return <Main searchParams={searchParams} id={id}></Main>
}
