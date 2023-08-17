import { httpClient } from '@/lib/http-client'

import {
  type GetCharacterComicsResponse,
  getCharacterComicsResponseSchema,
  type Character,
} from '../schemas'

export const getCharacterComics = async (characterId: Character['id']) => {
  const response = await httpClient
    .get(`characters/${characterId}/comics`, {
      searchParams: {
        orderBy: '-onsaleDate',
      },
    })
    .json<GetCharacterComicsResponse>()

  return getCharacterComicsResponseSchema.parse(response).data.results
}
