import { products } from '@/service';
import Main from './components/main';

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] };
}) {
  const productsResponse = await products({ queryArgs: searchParams });

  return <Main slug="" products={productsResponse.results}></Main>;
}
