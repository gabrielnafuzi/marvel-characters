import { Skeleton } from '@/components/ui/skeleton'

import { CharacterDetailsLoading } from './_components/character-details-loading'

export default function Loading() {
  return (
    <main className="container my-10 space-y-10">
      <Skeleton className="h-10 w-24" />

      <CharacterDetailsLoading />
    </main>
  )
}
