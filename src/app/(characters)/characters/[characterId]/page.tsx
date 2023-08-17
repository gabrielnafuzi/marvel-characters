import { type Metadata } from 'next'
import { redirect } from 'next/navigation'

import { GoBack } from '@/components/go-back'
import { siteConfig } from '@/config/site'
import { until } from '@/utils/until'

import { getCharacterById } from '../../_api/get-character-by-id'
import { type Character } from '../../schemas'
import { getThumbnailAsString } from '../../utils'
import { CharacterDetails } from './_components/character-details'

export const generateMetadata = async ({
  params: { characterId },
}: CharacterDetailsPageProps): Promise<Metadata> => {
  const [error, character] = await until(() => getCharacterById(characterId))

  if (error || !character) {
    return {
      title: 'Character details',
      description: 'Character details',
    }
  }

  const ogTitle = `${character.name} | Marvel Characters`

  return {
    title: character.name,
    description: character.description,
    metadataBase: new URL(siteConfig.url),
    openGraph: {
      type: 'website',
      locale: 'en_US',
      title: ogTitle,
      description: character.description,
      url: `${siteConfig.url}/characters/${character.id}`,
      images: [
        {
          url: getThumbnailAsString(character.thumbnail),
          width: 800,
          height: 600,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: character.description,
    },
  }
}

type CharacterDetailsPageProps = {
  params: {
    characterId: Character['id']
  }
}

export default async function CharacterDetailsPage({
  params: { characterId },
}: CharacterDetailsPageProps) {
  const [error, character] = await until(() => getCharacterById(characterId))

  if (error || !character) {
    return redirect('/')
  }

  const hasComics = character.comics.available > 0

  return (
    <main className="container my-10 space-y-10">
      <GoBack className="pl-0" />

      <CharacterDetails character={character} hasComics={hasComics} />
    </main>
  )
}
