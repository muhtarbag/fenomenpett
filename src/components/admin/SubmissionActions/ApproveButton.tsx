import { Check } from "lucide-react";
import { UseMutationResult } from "@tanstack/react-query";
import { Submission } from "../hooks/useSubmissions";

interface ApproveButtonProps {
  submissionId: number;
  mutation: UseMutationResult<
    Submission[],
    Error,
    { id: number; status: 'approved' | 'rejected' },
    unknown
  >;
}

export const ApproveButton = ({ submissionId, mutation }: ApproveButtonProps) => {
  const handleApprove = () => {
    console.log('👍 Approving submission:', submissionId);
    mutation.mutate(
      { id: submissionId, status: 'approved' },
      {
        onSuccess: () => {
          console.log('✅ Successfully approved submission:', submissionId);
        },
        onError: (error) => {
          console.error('❌ Error approving submission:', error);
        }
      }
    );
  };

  return (
    <button
      onClick={handleApprove}
      disabled={mutation.isPending}
      className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-success text-white rounded-md hover:bg-success/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Check size={20} />
      {mutation.isPending ? 'İşleniyor...' : 'Onayla'}
    </button>
  );
};