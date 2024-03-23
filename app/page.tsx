import { product } from '@/client';
import { ProductCard } from './components/product';

export default async function Page() {
  const productsResponse = await product();
  const products = productsResponse.results;
  const locale = 'en-US';

  return (
    <main>
      <ul className="grid">
        {products.map(product => (
          <li key={product.id}>
            <ProductCard
              locale={locale}
              product={product.masterData.current}
            ></ProductCard>
          </li>
        ))}
      </ul>
    </main>
  );
}
