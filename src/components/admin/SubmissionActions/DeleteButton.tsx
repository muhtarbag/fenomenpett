import { Trash2 } from "lucide-react";
import { UseMutationResult } from "@tanstack/react-query";
import { Submission } from "../hooks/useSubmissions";
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
  mutation: UseMutationResult<Submission[], Error, number, unknown>;
  className?: string;
}

export const DeleteButton = ({ submissionId, mutation, className = "flex-1" }: DeleteButtonProps) => {
  const handleDelete = () => {
    console.log('🗑️ Deleting submission:', submissionId);
    mutation.mutate(submissionId, {
      onSuccess: () => {
        console.log('✅ Successfully deleted submission:', submissionId);
      },
      onError: (error) => {
        console.error('❌ Error deleting submission:', error);
      }
    });
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