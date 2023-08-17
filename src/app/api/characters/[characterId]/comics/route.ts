import { kv } from '@vercel/kv'
import { NextResponse } from 'next/server'

import { getCharacterComicsResponseSchema } from '@/app/(characters)/schemas'
import { ONE_DAY_IN_SECONDS } from '@/constants'
import { serverHttpClient } from '@/lib/http-client.server'

const createCacheKey = (characterId: string, searchParams: URLSearchParams) => {
  const params = Object.fromEntries(searchParams.entries())

  return JSON.stringify({ characterId, params })
}

export async function GET(
  request: Request,
  { params }: { params: { characterId: string } },
) {
  const { searchParams } = new URL(request.url)

  const cacheKey = createCacheKey(params.characterId, searchParams)

  const cachedResponse = await kv.get(cacheKey)

  if (cachedResponse) {
    return NextResponse.json(cachedResponse)
  }

  const response = await serverHttpClient
    .get(`characters/${params.characterId}/comics`, {
      searchParams: Object.fromEntries(searchParams.entries()),
    })
    .json()

  const parsedResponse = getCharacterComicsResponseSchema.parse(response)

  await kv.set(cacheKey, parsedResponse, { ex: ONE_DAY_IN_SECONDS })

  return NextResponse.json(parsedResponse)
}
