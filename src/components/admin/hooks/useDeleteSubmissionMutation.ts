import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useDeleteSubmissionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      console.log('🗑️ Starting deletion process for submission:', id);

      try {
        // First delete from submission_likes table
        const { error: likesError } = await supabase
          .from('submission_likes')
          .delete()
          .eq('submission_id', id);

        if (likesError) {
          console.error('❌ Error deleting from submission_likes:', likesError);
          throw new Error(`Failed to delete likes: ${likesError.message}`);
        }

        // Then delete from rejected_submissions table if it exists there
        const { error: rejectedError } = await supabase
          .from('rejected_submissions')
          .delete()
          .eq('original_submission_id', id);

        if (rejectedError) {
          console.error('❌ Error deleting from rejected_submissions:', rejectedError);
          throw new Error(`Failed to delete rejected submission: ${rejectedError.message}`);
        }

        // Finally delete from submissions table
        const { error: submissionError } = await supabase
          .from('submissions')
          .delete()
          .eq('id', id);

        if (submissionError) {
          console.error('❌ Error deleting from submissions:', submissionError);
          throw new Error(`Failed to delete submission: ${submissionError.message}`);
        }

        console.log('✅ Successfully deleted submission and related records');
        return id;
      } catch (error: any) {
        console.error('❌ Delete operation failed:', error);
        throw error;
      }
    },
    onSuccess: (deletedId) => {
      console.log('✨ Delete mutation success:', deletedId);
      toast.success("İçerik başarıyla silindi");
      
      // First update the cache to immediately remove the deleted item
      queryClient.setQueryData(['submissions'], (oldData: any[]) => {
        if (!oldData) return [];
        console.log('🔄 Updating cache, removing submission:', deletedId);
        return oldData.filter(submission => submission.id !== deletedId);
      });
      
      // Then invalidate and refetch to ensure data consistency
      queryClient.invalidateQueries({ 
        queryKey: ['submissions'],
        refetchType: 'all'
      });
    },
    onError: (error: Error) => {
      console.error('❌ Delete mutation error:', error);
      toast.error(`Silme işlemi başarısız: ${error.message}`);
    }
  });
};