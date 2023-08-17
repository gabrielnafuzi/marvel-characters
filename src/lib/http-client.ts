import ky from 'ky'

import { env } from '@/env.mjs'

const getPrefixUrl = () => {
  if (typeof window !== 'undefined') return ''
  if (env.VERCEL_URL) return `https://${env.VERCEL_URL}`

  return `http://localhost:${env.PORT}`
}

export const httpClient = ky.create({
  prefixUrl: `${getPrefixUrl()}/api`,
})
