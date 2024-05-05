import Main from '@/app/_components/main'

export const revalidate = 0

export default async function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  return <Main searchParams={searchParams} />
}
