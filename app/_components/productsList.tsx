'use client'
import { ProductProjection } from './types'
import { ProductCard } from './productCard'
import { useInView } from 'react-intersection-observer'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'

export function ProductList({
  initialProducts,
  categoryId,
}: {
  initialProducts: ProductProjection[]
  categoryId?: string
}) {
  const [allProducts, setAllProducts] = useState(initialProducts)
  const [offset, setOffset] = useState(0)
  const [loaders, setLoaders] = useState<React.ReactNode[] | null>(null)
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

        setLoaders(
          new Array(16).fill(0).map((value, index) => (
            <li key={index}>
              <ProductCard />
            </li>
          ))
        )

        const response = await fetch(`/api/product?${params.toString()}`)

        if (response.ok) {
          const newProducts = (await response.json()) as ProductProjection[]

          setOffset(newOffset)
          setAllProducts((products) => [...products, ...newProducts])
          setLoaders(null)
        } else console.error(await response.json())
      }

      fetchProducts()
    },
  })

  const skeletons = loaders ? loaders : []

  return (
    <ul className="grid">
      {allProducts.length == 0
        ? 'Nothing was found'
        : [
            ...allProducts.map((product, idx, arr) => (
              <li key={product.id} ref={arr.length - 1 == idx ? ref : null}>
                <ProductCard product={product} />
              </li>
            )),
            ...skeletons,
          ]}
    </ul>
  )
}
