'use client';
import { useProducts } from '@/app/components/productsHook';
import { notFound } from 'next/navigation';

export default function Page({ params }: { params: { slug: string } }) {
  const products = useProducts();
  const locale = 'en-US';

  if (!products) return null;

  const product = products.find(
    product => product.masterData.current.slug[locale] == params.slug
  );

  return product ? (
    <>
      <h1>{product.masterData.current.name[locale]}</h1>
    </>
  ) : (
    notFound()
  );
}
