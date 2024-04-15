import { ProductProjection } from '@commercetools/platform-sdk';
import { Filters } from './filters';
import { ProductList } from './productsList';
import { CategoryList } from './categoryList';

export default function Main({
  products,
  slug,
  id,
}: {
  products: ProductProjection[];
  slug: string;
  id?: string;
}) {
  return (
    <>
      <Filters></Filters>
      <ProductList id={id} products={products}></ProductList>
      <CategoryList slug={slug}></CategoryList>
    </>
  );
}
