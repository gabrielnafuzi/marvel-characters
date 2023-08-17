import { useQuery, type UseQueryOptions } from '@tanstack/react-query'

import { httpClient } from '@/lib/http-client'
import { type ExtractFnReturnType } from '@/lib/query-client'

import { DEFAULT_ORDER_BY } from '../constants'
import {
  getCharactersResponseSchema,
  type GetCharactersResponse,
  type OrderBy,
} from '../schemas'
import { fixCharacterData } from './utils'

type GetCharactersParams = {
  page: number
  search?: string
  orderBy?: OrderBy
}

const LIMIT = 20
const getOffset = (page: number) => (page - 1) * LIMIT

export const getCharacters = async ({
  page,
  search,
  orderBy = DEFAULT_ORDER_BY,
}: GetCharactersParams) => {
  const response = await httpClient
    .get('characters', {
      searchParams: {
        offset: getOffset(page),
        limit: LIMIT,
        ...(search ? { nameStartsWith: search } : {}),
        orderBy,
      },
    })
    .json<GetCharactersResponse>()

  const parsedResponse = getCharactersResponseSchema.parse(response)

  return {
    ...parsedResponse.data,
    results: parsedResponse.data.results.map(fixCharacterData),
  } satisfies GetCharactersResponse['data']
}

type QueryFnType = typeof getCharacters

export const GET_CHARACTERS_QUERY_KEY_PREFIX = 'get-characters'

const FIVE_MINUTES = 1000 * 60 * 5

export const makeCharactersQueryOptions = ({
  page,
  orderBy,
  search,
}: GetCharactersParams) => {
  return {
    queryKey: [GET_CHARACTERS_QUERY_KEY_PREFIX, { page, orderBy, search }],
    queryFn: () => getCharacters({ page, orderBy, search }),
    staleTime: FIVE_MINUTES,
    cacheTime: FIVE_MINUTES * 2,
    keepPreviousData: true,
  } satisfies UseQueryOptions<ExtractFnReturnType<QueryFnType>>
}

export const useGetCharactersQuery = (
  params: GetCharactersParams,
  { enabled = true }: { enabled?: boolean } = {},
) => {
  // eslint-disable-next-line @tanstack/query/prefer-query-object-syntax
  return useQuery({ ...makeCharactersQueryOptions(params), enabled })
}
