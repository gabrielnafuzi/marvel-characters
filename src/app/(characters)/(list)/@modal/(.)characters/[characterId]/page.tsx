import { Suspense } from 'react'

import { getCharacterById } from '@/app/(characters)/_api/get-character-by-id'
import { CharacterDetails } from '@/app/(characters)/characters/[characterId]/_components/character-details'
import { CharacterDetailsLoading } from '@/app/(characters)/characters/[characterId]/_components/character-details-loading'
import { type Character } from '@/app/(characters)/schemas'
import { until } from '@/utils/until'

import { CharacterDialog } from './_components/character-dialog'

type CharacterModalProps = {
  params: {
    characterId: Character['id']
  }
}

export default function CharacterModal({
  params: { characterId },
}: CharacterModalProps) {
  return (
    <CharacterDialog>
      <Suspense fallback={<CharacterDetailsLoading />}>
        <CharacterDetailsWrapper characterId={characterId} />
      </Suspense>
    </CharacterDialog>
  )
}

type CharacterDetailsWrapperProps = {
  characterId: Character['id']
}

async function CharacterDetailsWrapper({
  characterId,
}: CharacterDetailsWrapperProps) {
  const [, character] = await until(() => getCharacterById(characterId))

  const hasComics = character!.comics.items.length > 0

  return <CharacterDetails character={character!} hasComics={hasComics} />
}
