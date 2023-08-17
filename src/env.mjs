// @ts-check
import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']),
    MARVEL_API_PRIVATE_KEY: z.string(),
    MARVEL_API_PUBLIC_KEY: z.string(),
    MARVEL_API_URL: z.string().url(),
    VERCEL_URL: z.string().url().optional(),
    PORT: z.coerce.number().default(3000),
  },

  client: {},

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    MARVEL_API_URL: process.env.MARVEL_API_URL,
    MARVEL_API_PUBLIC_KEY: process.env.MARVEL_API_PUBLIC_KEY,
    MARVEL_API_PRIVATE_KEY: process.env.MARVEL_API_PRIVATE_KEY,
    VERCEL_URL: process.env.VERCEL_URL,
    PORT: process.env.PORT,
  },
})
