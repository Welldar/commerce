'use client';
import { product } from '@/client';
import { Product, ProductProjection } from '@commercetools/platform-sdk';
import { useContext, createContext, useState, useEffect } from 'react';

const ProductsContext = createContext<ProductProjection[] | null>(null);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<ProductProjection[] | null>(null);
  useEffect(() => {
    const download = async () => {
      const products = await product();
      setProducts(products.results);
    };

    download();
  }, []);

  return (
    <ProductsContext.Provider value={products}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const products = useContext(ProductsContext);

  return products;
}
