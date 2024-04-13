'use client';
import { ProductProjection } from '@commercetools/platform-sdk';
import { ProductCard } from './product';
import { useInView } from 'react-intersection-observer';
import { useState } from 'react';

export function ProductList({ products }: { products: ProductProjection[] }) {
  const [allProducts, setAllProducts] = useState(products);
  const [offset, setOffset] = useState(0);
  const { ref } = useInView({
    triggerOnce: true,
    onChange: inView => {
      if (!inView) return;

      const fetchProducts = async () => {
        const newOffset = offset + 20;
        const response = await fetch(`/product?offset=${newOffset}`);
        const newProducts = (await response.json()) as ProductProjection[];

        setOffset(newOffset);
        setAllProducts(products => [...products, ...newProducts]);
      };

      fetchProducts();
    },
  });
  const locale = 'en-US';

  return (
    <ul className="grid">
      {allProducts.map((product, idx, arr) => (
        <li key={product.id} ref={arr.length - 1 == idx ? ref : null}>
          <ProductCard locale={locale} product={product}></ProductCard>
        </li>
      ))}
    </ul>
  );
}
