import { Skeleton } from '@/components/ui/skeleton'

export const CharacterDetailsLoading = () => {
  return (
    <div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-[auto,1fr] sm:gap-10">
        <Skeleton className="h-10 w-72 sm:hidden" />

        <Skeleton className="h-[540px] w-full sm:w-[400px] md:w-[440px]" />

        <div>
          <Skeleton className="mb-4 hidden h-10 w-full max-w-[280px] sm:block" />

          <div className="space-y-1">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-2/5" />
          </div>
        </div>
      </div>

      <div className="mt-24">
        <Skeleton className="h-10 w-56" />
      </div>
    </div>
  )
}
