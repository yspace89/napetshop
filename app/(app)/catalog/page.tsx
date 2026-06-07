import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { CatalogClient } from '@/components/catalog/CatalogClient'

export const metadata = {
  title: 'Katalog Produk | NA Mini-App',
}

export default async function CatalogPage() {
  const session = await getServerSession(authOptions)
  const user = session!.user as any

  return (
    <CatalogClient advisorId={user.id} />
  )
}
