import { useQuery } from '@tanstack/react-query'
import camelCase from 'lodash.camelcase'
import Vibrant from 'node-vibrant'

export type PaletteColors = {
  vibrant?: string
  muted?: string
  darkVibrant?: string
  darkMuted?: string
  lightVibrant?: string
  lightMuted?: string
  [name: string]: string | undefined
}

export const getPalette = async (src: string) => {
  const palette = await Vibrant.from(src).getPalette()

  return Object.entries(palette).reduce<PaletteColors>(
    (acc, [name, swatch]) => ({
      ...acc,
      ...(swatch ? { [camelCase(name)]: swatch.hex } : {}),
    }),
    {},
  )
}

export const usePalette = (imageSrc: string) => {
  const { data, isLoading, error } = useQuery({
    queryFn: () => getPalette(imageSrc),
    queryKey: ['get-palette', imageSrc],
    staleTime: Infinity,
    cacheTime: Infinity,
  })

  return { data, isLoading, error }
}
