import Main from '@/app/components/main';
import { parseParams } from '@/app/utility';
import { category, products } from '@/service';
import { notFound } from 'next/navigation';

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
