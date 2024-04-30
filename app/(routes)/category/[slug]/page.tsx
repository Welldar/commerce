import Main from '@/app/_components/main';
import { parseParams } from '@/app/_utils/utility';
import { category, products } from '@/app/_services/commerce';
import { notFound } from 'next/navigation';

export const revalidate = 0;

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const cat = await category();
  const id = cat.results.find(c => c.slug['en-US'] == params.slug)?.id;

  if (!id) return notFound();

  const query = parseParams(searchParams);

  const productsData = await products({ queryArgs: query }, id);

  return <Main slug={params.slug} products={productsData} id={id}></Main>;
}
