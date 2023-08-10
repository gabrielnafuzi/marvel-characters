import { Suspense } from 'react'

import { CardListSkeleton } from '@/app/(characters)/_components/card-list-skeleton'
import { type Character } from '@/app/(characters)/schemas'
import { getThumbnailAsString } from '@/app/(characters)/utils'
import { cn } from '@/utils'

import { CharacterThumbnail } from './character-thumbnail'
import { ComicList } from './comic-list'
import { NoComicsFound } from './no-comics-found'

type CharacterProps = {
  character: Character
  hasComics: boolean
}

export const CharacterDetails = ({ character, hasComics }: CharacterProps) => {
  return (
    <>
      <section>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-[auto,1fr] sm:gap-10">
          <h1 className="text-4xl font-semibold sm:hidden">{character.name}</h1>

          <CharacterThumbnail
            thumbnail={getThumbnailAsString(character.thumbnail)}
            name={character.name}
          />

          <div>
            <h1 className="mb-4 hidden text-4xl font-semibold sm:block">
              {character.name}
            </h1>
            <p className="mt-2 sm:mt-0">{character.description}</p>
          </div>
        </div>
      </section>

      <section className="mt-24">
        <h2
          className={cn(
            'relative mb-10 text-3xl font-semibold uppercase leading-[0.9] -tracking-[1px]',
            'before:absolute before:-top-[8px] before:left-[53px] before:block before:h-0.5 before:w-5 before:origin-bottom-left before:-rotate-45 before:skew-x-[45deg] before:bg-secondary',
            'after:absolute after:-left-[6px] after:top-[calc(100%+3px)] after:block after:h-0.5 after:w-5 after:origin-top-right after:-rotate-45 after:skew-x-[45deg] after:bg-secondary',
          )}
        >
          Comics
        </h2>

        {hasComics ? (
          <Suspense fallback={<CardListSkeleton amount={10} />}>
            <ComicList characterId={character.id} />
          </Suspense>
        ) : (
          <NoComicsFound />
        )}
      </section>
    </>
  )
}
