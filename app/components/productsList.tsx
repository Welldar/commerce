'use client';
import { ProductProjection } from '@commercetools/platform-sdk';
import { ProductCard } from './product';
import { InView } from 'react-intersection-observer';
import { useState } from 'react';

export function ProductList({ products }: { products: ProductProjection[] }) {
  const [allProducts, setAllProducts] = useState(products);
  const [offset, setOffset] = useState(0);
  const locale = 'en-US';

  return (
    <ul className="grid">
      {allProducts.map((product, idx, arr) => (
        <li key={product.id}>
          {arr.length - 1 == idx ? (
            <InView triggerOnce>
              {({ inView, ref }) => {
                console.log('works', inView);

                if (inView) {
                  setAllProducts(products => [...products]);
                  setOffset(offset => offset + 19);
                }

                return (
                  <ProductCard
                    ref={ref}
                    locale={locale}
                    product={product}
                  ></ProductCard>
                );
              }}
            </InView>
          ) : (
            <ProductCard locale={locale} product={product}></ProductCard>
          )}
        </li>
      ))}
    </ul>
  );
}
