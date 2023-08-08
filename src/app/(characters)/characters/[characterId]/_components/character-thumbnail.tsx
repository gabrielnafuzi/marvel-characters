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

const ROTATION_FACTOR = 30

const BlurBlob = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        'absolute h-52 w-52 rounded-md opacity-50 blur-2xl filter',
        className,
      )}
    />
  )
}

const DEFAULT_COLOR = 'hsl(var(--secondary))'

type CharacterThumbnailProps = {
  thumbnail: string
  name?: string
}

export const CharacterThumbnail = ({
  thumbnail,
  name,
}: CharacterThumbnailProps) => {
  const palette = usePalette(thumbnail)

  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)

  const onMouseMove = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const card = event.currentTarget
      const box = card.getBoundingClientRect()
      const x = event.clientX - box.left
      const y = event.clientY - box.top
      const centerX = box.width / 2
      const centerY = box.height / 2

      rotateX.set((y - centerY) / ROTATION_FACTOR)
      rotateY.set((centerX - x) / ROTATION_FACTOR)
    },
    [rotateX, rotateY],
  )

  const onMouseLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <motion.figure
      className="relative h-[540px] w-full transition-[all_400ms_cubic-bezier(0.03,0.98,0.52,0.99)_0s] will-change-transform sm:w-[400px] md:w-[440px]"
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
      <BlurBlob className="-left-1 -top-1 bg-[var(--palette-muted)]" />
      <BlurBlob className="-right-1 -top-1 bg-[var(--palette-darkMuted)]" />

      <BlurBlob className="-left-0 top-1/2 -translate-y-1/2 bg-[var(--palette-lightMuted)]" />
      <BlurBlob className="-right-0 top-1/2 -translate-y-1/2 bg-[var(--palette-vibrant)]" />

      <BlurBlob className="-bottom-1 -left-1 bg-[var(--palette-darkVibrant)]" />
      <BlurBlob className="-bottom-1 -right-1 bg-[var(--palette-lightVibrant)]" />

      <Image
        src={thumbnail}
        className="block h-full w-full rounded-sm object-cover object-center"
        sizes="(min-width: 768px) 400px, 440px"
        alt={name ?? 'Character'}
        fill
      />
    </motion.figure>
  )
}
