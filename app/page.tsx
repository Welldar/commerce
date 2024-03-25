import { product } from '@/client';
import Main from './components/main';

export default async function Page() {
  const productsResponse = await product();

  return <Main slug="" products={productsResponse.results}></Main>;
}
