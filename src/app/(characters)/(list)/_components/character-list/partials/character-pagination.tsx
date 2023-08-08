import { useEffect, useRef } from 'react'

import { usePathname } from 'next/navigation'

import { PAGE_QUERY_PARAM } from '@/app/(characters)/constants'
import {
  Pagination,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
  usePagination,
} from '@/components/ui/pagination'
import { useSetQueryStringState } from '@/hooks/use-set-query-string-state'

type CharactersPaginationProps = {
  pageSize: number
  total: number
  page: number
}

export const CharactersPagination = ({
  pageSize,
  total,
  page,
}: CharactersPaginationProps) => {
  const pathname = usePathname()
  const isOnCharactersPage = pathname.startsWith('/characters')

  const setQueryStringState = useSetQueryStringState()

  const pagination = usePagination({
    id: 'characters-pagination',
    page,
    count: total,
    pageSize,
    onChange: ({ page }) => {
      setQueryStringState({ [PAGE_QUERY_PARAM]: page.toString() })
    },
  })

  const stableSetCount = useRef(pagination.setCount).current
  const stableSetPage = useRef(pagination.setPage).current

  useEffect(() => {
    if (isOnCharactersPage) return

    stableSetCount(total)
  }, [isOnCharactersPage, pathname, stableSetCount, total])

  useEffect(() => {
    if (isOnCharactersPage) return

    stableSetPage(page)
  }, [isOnCharactersPage, page, stableSetPage])

  useEffect(() => {
    if (isOnCharactersPage) return

    if (page > pagination.totalPages) {
      setQueryStringState({ [PAGE_QUERY_PARAM]: '1' })
    }
  }, [isOnCharactersPage, page, pagination.totalPages, setQueryStringState])

  return (
    <Pagination api={pagination}>
      <PaginationPrevious showLabel />
      <div className="hidden gap-1 sm:inline-flex">
        <PaginationList />
      </div>
      <PaginationNext showLabel />
    </Pagination>
  )
}
