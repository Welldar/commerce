import { Suspense } from 'react';
import Login from '../components/login';
import Loading from '../loading';

export default function Page() {
  return (
    <Suspense fallback={<h1>loading from login page</h1>}>
      <Login isLogin />
    </Suspense>
  );
}
