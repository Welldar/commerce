import { product } from '@/client';
import Main from './components/main';

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  console.log(searchParams);

  const productsResponse = await product(searchParams);

  return <Main slug="" products={productsResponse.results}></Main>;
}
