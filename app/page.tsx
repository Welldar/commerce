import { products } from '@/service';
import Main from './components/main';

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const query = new URLSearchParams();
  for (let [q, value] of Object.entries(searchParams ?? {})) {
    if (Array.isArray(value)) {
      value.forEach(v => query.append(q, v));
    } else query.append(q, value ?? '');
  }

  const productsResponse = await products({ queryArgs: query });

  return <Main slug="" products={productsResponse.results}></Main>;
}
