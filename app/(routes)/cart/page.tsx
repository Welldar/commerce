import { getSession } from '@/app/_utils/server-utility'
import { getCart } from '@/app/_services/user'
import { Cart } from './cart'

export default async function Page() {
  const { access_token, anonymous_token } = await getSession()
  const token = access_token ?? anonymous_token
  const cart = token ? await getCart(token) : null

  return <Cart syncCart={cart} />
}
