'use client'

import { useEffect } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import {
  makeCharactersQueryOptions,
  useGetCharactersQuery,
} from '@/app/(characters)/_api/get-characters'
import { CardListSkeleton } from '@/app/(characters)/_components/card-list-skeleton'
import { CardsGrid } from '@/app/(characters)/_components/cards-grid'
import { ImageWithTitleCard } from '@/app/(characters)/_components/image-with-title-card'
import {
  DEFAULT_ORDER_BY,
  ORDER_BY_SEARCH_PARAM,
  PAGE_QUERY_PARAM,
  SEARCH_QUERY_PARAM,
} from '@/app/(characters)/constants'
import { type Character, type OrderBy } from '@/app/(characters)/schemas'
import { getThumbnailAsString } from '@/app/(characters)/utils'
import { Button } from '@/components/ui/button'
import { usePrevious } from '@/hooks/use-previous'

import { CharactersPagination } from './partials/character-pagination'

export const CharacterList = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const router = useRouter()

  const orderBy = (searchParams.get(ORDER_BY_SEARCH_PARAM) ??
    DEFAULT_ORDER_BY) as OrderBy

  const search = searchParams.get(SEARCH_QUERY_PARAM) ?? ''
  const searchParamsPage = searchParams.get(PAGE_QUERY_PARAM)
  const page = searchParamsPage ? Number(searchParamsPage) : 1

  const isCharacterPage = pathname.startsWith('/characters')

  const {
    status,
    data: queryData,
    isPreviousData,
  } = useGetCharactersQuery(
    {
      page,
      orderBy,
      search,
    },
    { enabled: !isCharacterPage },
  )

  const hasMoreData =
    queryData && queryData?.offset + queryData?.limit < queryData?.total

  const previousQueryData = usePrevious(queryData)

  // Prefetch the next page!
  useEffect(() => {
    if (!isPreviousData && hasMoreData) {
      queryClient.prefetchQuery(
        makeCharactersQueryOptions({
          page: page + 1,
          orderBy,
          search,
        }),
      )
    }
  }, [
    queryData,
    hasMoreData,
    isPreviousData,
    orderBy,
    page,
    queryClient,
    search,
  ])

  if (status === 'loading') {
    return <CardListSkeleton />
  }

  if (status === 'error') {
    return (
      <div className="mt-10 flex flex-col items-center justify-center gap-4">
        <p className="text-center text-xl">
          Sorry, something went wrong. Please try again.
        </p>

        <Button onClick={router.refresh} variant="outline">
          Retry
        </Button>
      </div>
    )
  }

  // We need this because when we show the intercepting character page(@modal/character/[characterId])
  // we lose the url query params and it shows the data from the first page, so this prevents that to happen
  const data = isCharacterPage ? previousQueryData! : queryData

  if (data.total === 0) {
    return (
      <p className="mt-10 text-center text-xl">
        Sorry, we couldn&apos;t find any character matching{' '}
        <strong>&quot;{search}&quot;</strong>
      </p>
    )
  }

  return (
    <div className="my-10 space-y-10">
      <CardsGrid>
        {data.results.map((character) => (
          <li key={character.id}>
            <CharacterCard
              id={character.id}
              name={character.name}
              thumbnail={character.thumbnail}
            />
          </li>
        ))}
      </CardsGrid>

      <div className="flex w-full items-center justify-end sm:justify-center">
        <CharactersPagination
          pageSize={data.limit}
          total={data.total}
          page={page}
        />
      </div>
    </div>
  )
}

type CharacterCardProps = Pick<Character, 'id' | 'name' | 'thumbnail'>

const CharacterCard = ({ id, name, thumbnail }: CharacterCardProps) => {
  return (
    <Link className="no-underline" href={`/characters/${id}`}>
      <ImageWithTitleCard
        title={name}
        thumbnail={getThumbnailAsString(thumbnail)}
      />
    </Link>
  )
}
