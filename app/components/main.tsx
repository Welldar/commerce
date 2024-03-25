import { Product, ProductProjection } from '@commercetools/platform-sdk';
import { Filters } from './filters';
import { CategoryList } from './categoryList';
import { ProductCard } from './product';

export default function Main({
  products,
  slug,
}: {
  products: ProductProjection[];
  slug: string;
}) {
  const locale = 'en-US';
  return (
    <>
      <Filters></Filters>
      <ul className="grid">
        {products.map(product => (
          <li key={product.id}>
            <ProductCard locale={locale} product={product}></ProductCard>
          </li>
        ))}
      </ul>
      <CategoryList slug={slug}></CategoryList>
    </>
  );
}
