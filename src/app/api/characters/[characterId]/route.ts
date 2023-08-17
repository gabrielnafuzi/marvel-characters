import { kv } from '@vercel/kv'
import { NextResponse } from 'next/server'

import { getCharacterByIdResponseSchema } from '@/app/(characters)/schemas'
import { ONE_DAY_IN_SECONDS } from '@/constants'
import { serverHttpClient } from '@/lib/http-client.server'

const createCacheKey = (characterId: string) => {
  return `characters/${characterId}`
}

export async function GET(
  _request: Request,
  { params }: { params: { characterId: string } },
) {
  const cacheKey = createCacheKey(params.characterId)

  const cachedResponse = await kv.get(cacheKey)

  if (cachedResponse) {
    return NextResponse.json(cachedResponse)
  }

  const response = await serverHttpClient
    .get(`characters/${params.characterId}`)
    .json()

  const parsedResponse = getCharacterByIdResponseSchema.parse(response)

  await kv.set(cacheKey, parsedResponse, { ex: ONE_DAY_IN_SECONDS })

  return NextResponse.json(parsedResponse)
}
