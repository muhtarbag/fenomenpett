import { X } from "lucide-react";
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

interface RejectButtonProps {
  submissionId: number;
  mutation: UseMutationResult<
    Submission[],
    Error,
    { id: number; status: 'approved' | 'rejected' },
    unknown
  >;
}

export const RejectButton = ({ submissionId, mutation }: RejectButtonProps) => {
  const handleReject = () => {
    console.log('👎 Rejecting submission:', submissionId);
    mutation.mutate(
      { id: submissionId, status: 'rejected' },
      {
        onSuccess: (data) => {
          console.log('✅ Successfully rejected submission:', { id: submissionId, data });
        },
        onError: (error) => {
          console.error('❌ Error rejecting submission:', { id: submissionId, error });
        }
      }
    );
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          disabled={mutation.isPending}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-danger text-white rounded-md hover:bg-danger/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X size={20} />
          {mutation.isPending ? 'İşleniyor...' : 'Reddet'}
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Gönderiyi Reddet</AlertDialogTitle>
          <AlertDialogDescription>
            Bu gönderiyi reddetmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>İptal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleReject}
            className="bg-danger hover:bg-danger/90"
          >
            Reddet
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};