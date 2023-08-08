'use client'

import { useRouter } from 'next/navigation'

import { Dialog, DialogContent } from '@/components/ui/dialog'

type CharacterDialogProps = {
  children: React.ReactNode
}

export const CharacterDialog = ({ children }: CharacterDialogProps) => {
  const router = useRouter()

  return (
    <Dialog
      open
      onOpenChange={(value) => {
        if (!value) {
          router.back()
        }
      }}
    >
      <DialogContent className="max-h-[90%] overflow-y-auto sm:max-w-5xl">
        <div className="mt-10">{children}</div>
      </DialogContent>
    </Dialog>
  )
}
