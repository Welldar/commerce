import { product as productById } from '@/service';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
  const product = await productById(params.id);

  const locale = 'en-US';

  return product ? <h1>{product.name[locale]}</h1> : notFound();
}
