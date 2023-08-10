'use client'

import { useCallback, type MouseEvent } from 'react'

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  type MotionStyle,
} from 'framer-motion'
import Image from 'next/image'

import { usePalette } from '@/hooks/use-palette'
import { cn } from '@/utils'

const ROTATION_FACTOR = 25 // Lower is rotation is more intense

const BlurBlob = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        'absolute h-28 w-28 rounded-md opacity-50 blur-2xl filter sm:h-52 sm:w-52',
        className,
      )}
    />
  )
}

const DEFAULT_COLOR = '231 35 41' // rgb

type CharacterThumbnailProps = {
  thumbnail: string
  name?: string
}

export const CharacterThumbnail = ({
  thumbnail,
  name,
}: CharacterThumbnailProps) => {
  const palette = usePalette(thumbnail, 'rgb')

  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const onMouseMove = useCallback(
    ({ currentTarget, clientX, clientY }: MouseEvent<HTMLDivElement>) => {
      const { left, top, width, height } = currentTarget.getBoundingClientRect()

      const x = clientX - left
      const y = clientY - top
      const centerX = width / 2
      const centerY = height / 2

      rotateX.set((y - centerY) / ROTATION_FACTOR)
      rotateY.set((centerX - x) / ROTATION_FACTOR)

      mouseX.set(x)
      mouseY.set(y)
    },
    [mouseX, mouseY, rotateX, rotateY],
  )

  const onMouseLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <motion.figure
      className="group relative h-[340px] w-full transition-[all_400ms_cubic-bezier(0.03,0.98,0.52,0.99)_0s] will-change-transform sm:h-[540px] sm:w-[400px] md:w-[440px]"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={
        {
          transform: useMotionTemplate`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1, 1, 1)`,
          transition: 'all 400ms cubic-bezier(0.03, 0.98, 0.52, 0.99) 0s',

          '--palette-muted': palette.data?.muted ?? DEFAULT_COLOR,
          '--palette-vibrant': palette.data?.vibrant ?? DEFAULT_COLOR,

          '--palette-darkMuted': palette.data?.darkMuted ?? DEFAULT_COLOR,
          '--palette-darkVibrant': palette.data?.darkVibrant ?? DEFAULT_COLOR,

          '--palette-lightMuted': palette.data?.lightMuted ?? DEFAULT_COLOR,
          '--palette-lightVibrant': palette.data?.lightVibrant ?? DEFAULT_COLOR,
        } as MotionStyle
      }
    >
      {!palette.isLoading && (
        <>
          <BlurBlob className="-left-1 -top-1 bg-[rgb(var(--palette-muted))]" />
          <BlurBlob className="-right-1 -top-1 bg-[rgb(var(--palette-darkMuted))]" />

          <BlurBlob className="-left-0 top-1/2 -translate-y-1/2 bg-[rgb(var(--palette-lightMuted))]" />
          <BlurBlob className="-right-0 top-1/2 -translate-y-1/2 bg-[rgb(var(--palette-vibrant))]" />

          <BlurBlob className="-left-1 bottom-1 bg-[rgb(var(--palette-darkVibrant))] sm:-bottom-1" />
          <BlurBlob className="-right-1 bottom-1 bg-[rgb(var(--palette-lightVibrant))] sm:-bottom-1" />
        </>
      )}

      <Image
        src={thumbnail}
        className="block h-full w-full rounded-sm object-cover object-center"
        sizes="(min-width: 768px) 400px, 440px"
        alt={name ?? 'Character'}
        fill
      />

      <motion.div
        className={cn(
          'pointer-events-none absolute -inset-px z-10 rounded-xl opacity-0 transition duration-300',
          !palette.isLoading && 'group-hover:opacity-100',
        )}
        style={{
          background: useMotionTemplate`
            radial-gradient(
              500px circle at ${mouseX}px ${mouseY}px,
              rgb(var(--palette-lightVibrant) / 0.265),
              transparent 80%
            )
          `,
        }}
      />
    </motion.figure>
  )
}
