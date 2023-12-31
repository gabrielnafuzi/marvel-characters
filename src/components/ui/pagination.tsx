'use client'

import * as pagination from '@zag-js/pagination'
import { normalizeProps, useMachine } from '@zag-js/react'

import { Icons } from '@/components/icons'
import { cn, createSafeContext } from '@/utils'

import { Button, buttonVariants } from './button'

type PaginationContextValue = {
  api: ReturnType<typeof pagination.connect>
}

const [PaginationProvider, usePaginationContext] =
  createSafeContext<PaginationContextValue>(
    'usePaginationContext must be used within a PaginationProvider',
  )

type PaginationProps = {
  children: React.ReactNode
  className?: string
  api: ReturnType<typeof pagination.connect>
}

export const usePagination = (props: pagination.Context) => {
  const [state, send] = useMachine(
    pagination.machine({
      ...props,
    }),
  )

  const api = pagination.connect(state, send, normalizeProps)

  return api
}

export const Pagination = ({ children, className, api }: PaginationProps) => {
  return (
    <PaginationProvider value={{ api }}>
      <nav {...api.rootProps}>
        <ul className={cn('isolate inline-flex gap-1', className)}>
          {children}
        </ul>
      </nav>
    </PaginationProvider>
  )
}

type PaginationActionsProps = {
  className?: string
  showLabel?: boolean
}

export const PaginationPrevious = ({
  className,
  showLabel,
}: PaginationActionsProps) => {
  const { api } = usePaginationContext()

  return (
    <li>
      <Button
        variant="outline"
        className={cn(
          api.isFirstPage && 'pointer-events-none opacity-50',
          className,
        )}
        {...api.prevPageTriggerProps}
      >
        <Icons.ChevronLeft className="h-5 w-5" aria-hidden="true" />
        <span className={cn(!showLabel && 'sr-only')}>Previous</span>
      </Button>
    </li>
  )
}

export const PaginationNext = ({
  className,
  showLabel,
}: PaginationActionsProps) => {
  const { api } = usePaginationContext()

  return (
    <li>
      <Button
        variant="outline"
        className={cn(
          api.isLastPage && 'pointer-events-none opacity-50',
          className,
        )}
        {...api.nextPageTriggerProps}
      >
        <span className={cn(!showLabel && 'sr-only')}>Next</span>
        <Icons.ChevronRight className="h-5 w-5" aria-hidden="true" />
      </Button>
    </li>
  )
}

type PaginationListProps = {
  pageClassName?: string
  ellipsisClassName?: string
}

export const PaginationList = ({
  pageClassName,
  ellipsisClassName,
}: PaginationListProps) => {
  const { api } = usePaginationContext()

  return (
    <>
      {api.pages.map((page, idx) => {
        if (page.type === 'page') {
          return (
            <li key={page.value}>
              <Button
                variant="outline"
                className={cn(
                  'data-[selected]:border-primary data-[selected]:bg-primary data-[selected]:text-primary-foreground',
                  pageClassName,
                )}
                {...api.getPageTriggerProps(page)}
              >
                {page.value}
              </Button>
            </li>
          )
        }

        return (
          <li
            key={`ellipsis-${idx}`}
            className={cn(
              buttonVariants({
                variant: 'outline',
              }),
              ellipsisClassName,
            )}
          >
            <span {...api.getEllipsisProps({ index: idx })}>&#8230;</span>
          </li>
        )
      })}
    </>
  )
}
