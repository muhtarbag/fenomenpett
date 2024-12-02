import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useDeleteSubmissionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (submissionId: number) => {
      console.log('🗑️ Starting deletion process for submission:', submissionId);

      // First, delete associated likes
      const { error: likesError } = await supabase
        .from('submission_likes')
        .delete()
        .eq('submission_id', submissionId);

      if (likesError) {
        console.error('❌ Error deleting likes:', likesError);
        throw likesError;
      }

      // Then, delete associated rejected submissions
      const { error: rejectedError } = await supabase
        .from('rejected_submissions')
        .delete()
        .eq('original_submission_id', submissionId);

      if (rejectedError) {
        console.error('❌ Error deleting rejected submission:', rejectedError);
        throw rejectedError;
      }

      // Finally, delete the submission itself
      const { data, error: submissionError } = await supabase
        .from('submissions')
        .delete()
        .eq('id', submissionId)
        .select();

      if (submissionError) {
        console.error('❌ Error deleting submission:', submissionError);
        throw submissionError;
      }

      // If no rows were deleted, throw an error
      if (!data || data.length === 0) {
        const error = new Error('Submission not found or already deleted');
        console.error('❌ Submission not found:', error);
        throw error;
      }

      return submissionId;
    },
    onError: (error) => {
      console.error('❌ Delete mutation error:', error);
      toast.error("Gönderi silinirken bir hata oluştu");
    },
    onSuccess: (deletedId) => {
      console.log('✨ Delete mutation success:', deletedId);
      
      // Immediately update the cache to remove the deleted item
      queryClient.setQueryData(['submissions'], (oldData: any[] | undefined) => {
        if (!oldData) return [];
        return oldData.filter(submission => submission.id !== deletedId);
      });

      // Then invalidate to ensure fresh data
      queryClient.invalidateQueries({
        queryKey: ['submissions'],
        exact: true
      });
      
      toast.success("Gönderi başarıyla silindi");
    }
  });
};