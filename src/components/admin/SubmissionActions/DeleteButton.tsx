import { Trash2 } from "lucide-react";
import { UseMutationResult } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteButtonProps {
  submissionId: number;
  mutation: UseMutationResult<number, Error, number, unknown>;
  className?: string;
}

export const DeleteButton = ({ submissionId, mutation, className = "flex-1" }: DeleteButtonProps) => {
  const handleDelete = async () => {
    try {
      console.log('🗑️ DeleteButton: Starting deletion for submission:', submissionId);
      await mutation.mutateAsync(submissionId);
      console.log('✅ DeleteButton: Deletion completed successfully');
    } catch (error) {
      console.error('❌ DeleteButton: Error during deletion:', error);
      toast.error('Gönderi silinirken bir hata oluştu');
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          disabled={mutation.isPending}
          className={`flex items-center justify-center gap-2 py-2 px-4 bg-danger text-white rounded-md hover:bg-danger/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        >
          <Trash2 size={20} />
          {mutation.isPending ? 'Siliniyor...' : 'Sil'}
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Gönderiyi Sil</AlertDialogTitle>
          <AlertDialogDescription>
            Bu gönderiyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>İptal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-danger hover:bg-danger/90"
          >
            Sil
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};