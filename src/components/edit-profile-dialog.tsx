import { EditProfileDialogForm } from '@/components/edit-profile-dialog-form'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface EditProfileDialogProps {
  isEditProfileOpen: boolean
  setIsEditProfileOpen: (arg0: boolean) => void
}

export function EditProfileDialog({
  isEditProfileOpen,
  setIsEditProfileOpen,
}: EditProfileDialogProps) {
  return (
    <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
      <DialogContent className="space-y-2">
        <DialogHeader>
          <DialogTitle>Editar perfil</DialogTitle>
        </DialogHeader>

        <EditProfileDialogForm />
      </DialogContent>
    </Dialog>
  )
}
