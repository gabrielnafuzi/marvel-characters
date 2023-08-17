import { kv } from '@vercel/kv'
import { NextResponse } from 'next/server'

import { getCharactersResponseSchema } from '@/app/(characters)/schemas'
import { ONE_DAY_IN_SECONDS } from '@/constants'
import { serverHttpClient } from '@/lib/http-client.server'

const createCacheKey = (searchParams: URLSearchParams) => {
  const params = Object.fromEntries(searchParams.entries())

  return JSON.stringify(params)
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const cacheKey = createCacheKey(searchParams)

  const cachedResponse = await kv.get(cacheKey)

  if (cachedResponse) {
    return NextResponse.json(cachedResponse)
  }

  const response = await serverHttpClient
    .get('characters', {
      searchParams: Object.fromEntries(searchParams.entries()),
    })
    .json()

  const parsedResponse = getCharactersResponseSchema.parse(response)

  await kv.set(cacheKey, parsedResponse, { ex: ONE_DAY_IN_SECONDS })

  return NextResponse.json(parsedResponse)
}
