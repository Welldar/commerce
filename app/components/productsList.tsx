'use client';
import { ProductProjection } from '@commercetools/platform-sdk';
import { ProductCard } from './product';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export function ProductList({
  products,
  id,
}: {
  products: ProductProjection[];
  id?: string;
}) {
  const [allProducts, setAllProducts] = useState(products);
  const [offset, setOffset] = useState(0);
  const searchParams = useSearchParams();
  const { ref } = useInView({
    triggerOnce: true,
    onChange: inView => {
      if (!inView) return;

      const fetchProducts = async () => {
        const newOffset = offset + 20;
        const params = new URLSearchParams(searchParams.toString());
        params.set('offset', newOffset.toString());
        if (id) params.set('category', id);
        const response = await fetch(`/product?${params.toString()}`);
        const newProducts = (await response.json()) as ProductProjection[];

        setOffset(newOffset);
        setAllProducts(products => [...products, ...newProducts]);
      };

      fetchProducts();
    },
  });
  const locale = 'en-US';

  useEffect(() => {
    setAllProducts(products);
  }, [products]);

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
