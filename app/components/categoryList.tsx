import { category } from '@/service';
import Link from 'next/link';
import './category.css';

export async function CategoryList({ slug }: { slug: string }) {
  const cat = await category();
  const locale = 'en-US';

  const id = cat.results.find(c => c.slug[locale] == slug);

  const currentTree = id
    ? cat.results.filter(c => c.parent?.id == id.id)
    : cat.results.filter(c => !c.parent);

  const nav =
    id?.ancestors.map(c => cat.results.find(categor => categor.id == c.id)) ??
    [];

  nav.push(id);

  const navLinks = nav.map(c =>
    c ? (
      <Link key={c.id} href={c.slug[locale]}>
        {c.name[locale]}
      </Link>
    ) : null
  );

  navLinks.unshift(
    <Link key="/" href="/">
      All
    </Link>
  );

  return (
    <div>
      <h2>Категории</h2>
      <nav>{navLinks}</nav>
      <ul>
        {currentTree.map(c => (
          <li key={c.id}>
            <Link href={`/category/${c.slug[locale]}`}>{c.name[locale]}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
