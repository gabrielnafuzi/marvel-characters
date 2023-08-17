import ky from 'ky'

import { env } from '@/env.mjs'

import { md5 } from './md5'

const createServerAuthSearchParams = () => {
  const ts = Date.now()
  const publicKey = env.MARVEL_API_PUBLIC_KEY
  const privateKey = env.MARVEL_API_PRIVATE_KEY

  const hash = md5(`${ts}${privateKey}${publicKey}`)

  return {
    apikey: publicKey,
    ts,
    hash,
  }
}

export const serverHttpClient = ky.create({
  prefixUrl: env.MARVEL_API_URL,
  searchParams: {
    ...createServerAuthSearchParams(),
  },
})
