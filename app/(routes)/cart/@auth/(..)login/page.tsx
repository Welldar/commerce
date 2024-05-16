'use client'
import Login from '@/app/(routes)/login/login'
import { Modal } from '@/app/_components/modal/modal'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()
  return (
    <Modal onClose={() => router.back()}>
      <Login isLogin />
    </Modal>
  )
}
