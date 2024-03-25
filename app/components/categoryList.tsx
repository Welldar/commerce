'use client';
import { category } from '@/client';
import Link from 'next/link';

export async function CategoryList() {
  const cat = await category();
  return (
    <div>
      <h2>Категории</h2>
      <ul>
        {cat.results.map(c => (
          <li key={c.id}>
            <Link href={`category/${c.slug['en-US']}`}>{c.name['en-US']}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
