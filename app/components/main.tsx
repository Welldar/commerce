import { ProductProjection } from '@commercetools/platform-sdk';
import { Filters } from './filters';
import { ProductList } from './productsList';
import { CategoryList } from './categoryList';

export default function Main({
  products,
  slug,
}: {
  products: ProductProjection[];
  slug: string;
}) {
  return (
    <>
      <Filters></Filters>
      <ProductList products={products}></ProductList>
      <CategoryList slug={slug}></CategoryList>
    </>
  );
}
