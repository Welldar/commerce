import { ProductProjection } from '@commercetools/platform-sdk';
import { ProductCard } from './product';

export async function ProductList({
  products,
}: {
  products: ProductProjection[];
}) {
  const locale = 'en-US';

  return (
    <ul className="grid">
      {products.map(product => (
        <li key={product.id}>
          <ProductCard locale={locale} product={product}></ProductCard>
        </li>
      ))}
    </ul>
  );
}
