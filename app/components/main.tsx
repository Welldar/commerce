import {
  ProductProjection,
  ProductProjectionPagedSearchResponse,
} from '@commercetools/platform-sdk';
import { Filters } from './filters/filters';
import { ProductList } from './productsList';
import { CategoryList } from './categoryList';
import { productsResponse } from '@/service';
import { Suspense } from 'react';

export default function Main({
  products,
  slug,
  id,
}: {
  products: ProductProjectionPagedSearchResponse | null;
  slug: string;
  id?: string;
}) {
  return (
    <main>
      <Filters />
      {products ? (
        <Suspense>
          <ProductList id={id} products={products.results} />
        </Suspense>
      ) : (
        <div>No such a page</div>
      )}
      <CategoryList slug={slug} />
    </main>
  );
}
