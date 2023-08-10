import { useQuery } from '@tanstack/react-query'
import camelCase from 'lodash.camelcase'
import Vibrant from 'node-vibrant'
import { type Swatch } from 'node-vibrant/lib/color'

export type PaletteColors = {
  vibrant?: string
  muted?: string
  darkVibrant?: string
  darkMuted?: string
  lightVibrant?: string
  lightMuted?: string
}

export type ColorFormat = 'hex' | 'rgb'

const getSwatchColor = (swatch: Swatch, format: ColorFormat) => {
  switch (format) {
    case 'hex':
      return swatch.hex
    case 'rgb':
      return swatch.rgb.join(' ')
  }
}

export const getPalette = async (src: string, format: ColorFormat = 'hex') => {
  const palette = await Vibrant.from(src).getPalette()

  return Object.entries(palette).reduce<PaletteColors>(
    (acc, [name, swatch]) => ({
      ...acc,
      ...(swatch ? { [camelCase(name)]: getSwatchColor(swatch, format) } : {}),
    }),
    {},
  )
}

export const usePalette = (imageSrc: string, format: ColorFormat = 'hex') => {
  const { data, isLoading, error } = useQuery({
    queryFn: () => getPalette(imageSrc, format),
    queryKey: ['get-palette', imageSrc, format],
    staleTime: Infinity,
    cacheTime: Infinity,
  })

  return { data, isLoading, error }
}
