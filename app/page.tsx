import { products } from '@/service';
import Main from './components/main';
import { parseParams } from './utility';

export default async function Page({
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const query = parseParams(searchParams);

  const productsResponse = await products({ queryArgs: query });

  return <Main slug="" products={productsResponse}></Main>;
}
