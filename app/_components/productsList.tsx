'use client'
import { ProductProjection } from './types'
import { ProductCard } from './productCard'
import { useInView } from 'react-intersection-observer'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'

export function ProductList({
  products,
  categoryId,
}: {
  products: ProductProjection[]
  categoryId?: string
}) {
  const [allProducts, setAllProducts] = useState(products)
  const [offset, setOffset] = useState(0)
  const searchParams = useSearchParams()

  const { ref } = useInView({
    triggerOnce: true,
    onChange: (inView) => {
      if (!inView) return

      const fetchProducts = async () => {
        const newOffset = offset + 20
        const params = new URLSearchParams(searchParams.toString())
        params.set('offset', newOffset.toString())
        if (categoryId) params.set('category', categoryId)
        const response = await fetch(`/api/product?${params.toString()}`)
        const newProducts = (await response.json()) as ProductProjection[]

        setOffset(newOffset)
        setAllProducts((products) => [...products, ...newProducts])
      }

      fetchProducts()
    },
  })

  return (
    <ul className="grid">
      {allProducts.length == 0
        ? 'Nothing was found'
        : allProducts.map((product, idx, arr) => (
            <li key={product.id} ref={arr.length - 1 == idx ? ref : null}>
              <ProductCard product={product}></ProductCard>
            </li>
          ))}
    </ul>
  )
}
