import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function Loading() {
  return (
    <main>
      <Skeleton count={4}></Skeleton>
      <ProductListLoader />
      <Skeleton count={6}></Skeleton>
    </main>
  );
}

function ProductListLoader() {
  const productLoader = new Array(8).fill(
    <li>{new Array(5).fill(<Skeleton height={'100%'}></Skeleton>)}</li>
  );
  return <div className="grid">{productLoader}</div>;
}
