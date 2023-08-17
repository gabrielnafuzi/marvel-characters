import { httpClient } from '@/lib/http-client'

import {
  getCharacterByIdResponseSchema,
  type Character,
  type GetCharacterByIdResponse,
} from '../schemas'
import { fixCharacterData } from './utils'

export const getCharacterById = async (characterId: Character['id']) => {
  const response = await httpClient
    .get(`characters/${characterId}`)
    .json<GetCharacterByIdResponse>()

  const parsedResponse = getCharacterByIdResponseSchema.parse(response)
  const [character] = parsedResponse.data.results.map(fixCharacterData)

  return character
}
