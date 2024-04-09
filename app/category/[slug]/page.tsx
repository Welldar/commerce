import Main from '@/app/components/main';
import { category, productsByCategory } from '@/service';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { slug: string } }) {
  const cat = await category();
  const id = cat.results.find(c => c.slug['en-US'] == params.slug)?.id;

  if (!id) return notFound();
  const products = await productsByCategory(id);

  return <Main slug={params.slug} products={products.results}></Main>;
}
