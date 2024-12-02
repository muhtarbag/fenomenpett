import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useDeleteSubmissionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      console.log('🗑️ Starting deletion process for submission:', id);

      try {
        // First check if the submission exists in rejected_submissions
        console.log('🔍 Checking for rejected submissions with original_submission_id:', id);
        const { data: rejectedData, error: findError } = await supabase
          .from('rejected_submissions')
          .delete()
          .eq('original_submission_id', id);

        if (findError) {
          console.error('❌ Error deleting rejected submissions:', findError);
          throw new Error(`Failed to delete rejected submissions: ${findError.message}`);
        }
        console.log('✅ Checked/deleted rejected submissions');

        // Delete from submission_likes table
        console.log('🗑️ Deleting from submission_likes...');
        const { error: likesError } = await supabase
          .from('submission_likes')
          .delete()
          .eq('submission_id', id);

        if (likesError) {
          console.error('❌ Error deleting from submission_likes:', likesError);
          throw new Error(`Failed to delete likes: ${likesError.message}`);
        }
        console.log('✅ Deleted submission likes');

        // Finally delete from submissions table
        console.log('🗑️ Deleting from submissions table...');
        const { error: submissionError } = await supabase
          .from('submissions')
          .delete()
          .eq('id', id);

        if (submissionError) {
          console.error('❌ Error deleting from submissions:', submissionError);
          throw new Error(`Failed to delete submission: ${submissionError.message}`);
        }

        console.log('✅ Successfully deleted submission and all related records');
        return id;
      } catch (error: any) {
        console.error('❌ Delete operation failed:', error);
        throw error;
      }
    },
    onSuccess: (deletedId) => {
      console.log('✨ Delete mutation success:', deletedId);
      
      // Immediately update the cache to remove the deleted submission
      queryClient.setQueryData(['submissions'], (oldData: any) => {
        if (!oldData) return [];
        return oldData.filter((submission: any) => submission.id !== deletedId);
      });
      
      // Then invalidate the query to trigger a refetch
      queryClient.invalidateQueries({ 
        queryKey: ['submissions']
      });
      
      toast.success("İçerik başarıyla silindi");
    },
    onError: (error: Error) => {
      console.error('❌ Delete mutation error:', error);
      toast.error("Silme işlemi başarısız: " + error.message);
    }
  });
};