import { ProductProjection } from '@commercetools/platform-sdk';
import { Filters } from './filters/filters';
import { ProductList } from './productsList';
import { CategoryList } from './categoryList';
import { productsResponse } from '@/service';

export default function Main({
  products,
  slug,
  id,
}: {
  products: productsResponse;
  slug: string;
  id?: string;
}) {
  return (
    <main>
      <Filters></Filters>
      {'results' in products ? (
        <ProductList id={id} products={products.results}></ProductList>
      ) : (
        <div>{products.message}</div>
      )}
      <CategoryList slug={slug}></CategoryList>
    </main>
  );
}
