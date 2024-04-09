import { products } from '@/service';
import Main from './components/main';

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  console.log(searchParams);

  const productsResponse = await products(searchParams);

  return <Main slug="" products={productsResponse.results}></Main>;
}
