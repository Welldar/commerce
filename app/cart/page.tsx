import { Suspense } from 'react';
import { Cart } from '../components/cart';

export default function Page() {
  return (
    <Suspense fallback={<h1>loading from cart page</h1>}>
      <Cart></Cart>
    </Suspense>
  );
}
