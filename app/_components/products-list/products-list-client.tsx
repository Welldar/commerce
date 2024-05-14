'use client'
import { ProductCard } from '../product-card/product-card'
import { useInView } from 'react-intersection-observer'
import { useState } from 'react'
import { ProductProjection } from '../../_services/interfaces'

export function ProductListInner({
  initialProducts,
  categoryId,
  searchParams,
}: {
  initialProducts: ProductProjection[]
  searchParams: string
  categoryId?: string
}) {
  const [allProducts, setAllProducts] = useState(initialProducts)
  const [offset, setOffset] = useState(0)
  const [loaders, setLoaders] = useState<React.ReactNode[]>([])
  const limit = 20

  const { ref } = useInView({
    triggerOnce: true,
    onChange: (inView) => {
      if (!inView) return

      const fetchProducts = async () => {
        const newOffset = offset + limit
        const params = new URLSearchParams(searchParams.toString())

        params.set('offset', newOffset.toString())

        if (categoryId) params.set('category', categoryId)

        setLoaders(
          new Array(16).fill(0).map((_, index) => <ProductCard key={index} />)
        )

        const response = await fetch(`/api/product?${params.toString()}`)

        if (response.ok) {
          const newProducts = (await response.json()) as ProductProjection[]

          setOffset(newOffset)
          setAllProducts((products) => [...products, ...newProducts])
        } else console.error(await response.json())

        setLoaders([])
      }

      fetchProducts()
    },
  })

  return (
    <ul className="grid">
      {allProducts.length == 0
        ? 'Nothing was found'
        : [
            ...allProducts.map((product, idx, arr) => (
              <ProductCard
                key={product.id}
                ref={arr.length - limit / 2 == idx ? ref : null}
                product={product}
              />
            )),
            ...loaders,
          ]}
    </ul>
  )
}
