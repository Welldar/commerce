import { product } from '@/client';
import { ProductCard } from './components/product';
import { CategoryList } from './components/categoryList';
import { Filters } from './components/filters';

export default async function Page() {
  const productsResponse = await product();
  const products = productsResponse.results;
  const locale = 'en-US';

  return (
    <main>
      <Filters></Filters>
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
      <CategoryList></CategoryList>
    </main>
  );
}
