import { getCategories } from '../../_services/storefront'
import Link from 'next/link'
import styles from './category-list.module.css'

export async function CategoryList({ categoryId }: { categoryId?: string }) {
  const locale = 'en-US'
  const categories = await getCategories()

  const currentCategory = categories.results.find(
    (category) => category.id == categoryId
  )

  const currentTree = categoryId
    ? categories.results.filter((category) => category.parent?.id == categoryId)
    : categories.results.filter((category) => !category.parent)

  const nav = [
    ...(currentCategory?.ancestors.map(({ id }) =>
      categories.results.find((category) => category.id == id)
    ) ?? []),
    currentCategory,
  ]

  const breadcrumbs = [
    <Link key="/" href="/">
      All
    </Link>,
    ...nav.map((category) =>
      category ? (
        <Link key={category.id} href={category.slug[locale]}>
          {category.name[locale]}
        </Link>
      ) : null
    ),
  ]

  return (
    <>
      <nav className={styles.nav}>{breadcrumbs}</nav>
      <ul className={styles.list}>
        {currentTree.map((c) => (
          <li key={c.id}>
            <Link href={`/category/${c.slug[locale]}`}>{c.name[locale]}</Link>
          </li>
        ))}
      </ul>
    </>
  )
}
