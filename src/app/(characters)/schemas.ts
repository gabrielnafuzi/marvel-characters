import { z } from 'zod'

export const orderBySchema = z.enum(['name', '-name', 'modified', '-modified'])
export type OrderBy = z.infer<typeof orderBySchema>

export const characterSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  thumbnail: z.object({
    path: z.string(),
    extension: z.string(),
  }),
  comics: z.object({
    available: z.number(),
  }),
})

export type Character = z.infer<typeof characterSchema>

export const itemSchema = z.object({
  resourceURI: z.string(),
  name: z.string(),
  role: z.string().optional(),
  type: z.string().optional(),
})

export const comicSchema = z.object({
  id: z.number(),
  title: z.string(),
  thumbnail: z.object({
    path: z.string(),
    extension: z.string(),
  }),
  urls: z.array(z.object({ type: z.string(), url: z.string() })),
})

export type Comic = z.infer<typeof comicSchema>

export const getCharactersResponseSchema = z.object({
  data: z.object({
    offset: z.number(),
    limit: z.number(),
    total: z.number(),
    count: z.number(),
    results: z.array(characterSchema),
  }),
})

export type GetCharactersResponse = z.infer<typeof getCharactersResponseSchema>

export const getCharacterByIdResponseSchema = z.object({
  data: z.object({
    results: z.array(characterSchema),
  }),
})

export type GetCharacterByIdResponse = z.infer<
  typeof getCharacterByIdResponseSchema
>

export const getCharacterComicsResponseSchema = z.object({
  data: z.object({
    results: z.array(comicSchema),
  }),
})

export type GetCharacterComicsResponse = z.infer<
  typeof getCharacterComicsResponseSchema
>
