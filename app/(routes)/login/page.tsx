import { Suspense } from 'react'
import Login from './login'

export default function Page() {
  return (
    <Suspense fallback={<h1>loading from login page</h1>}>
      <Login isLogin />
    </Suspense>
  )
}
