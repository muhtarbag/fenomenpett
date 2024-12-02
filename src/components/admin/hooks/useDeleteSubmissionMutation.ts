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
          .select('*')
          .eq('original_submission_id', id);

        console.log('🔍 Rejected submissions check result:', { 
          rejectedData, 
          findError,
          found: rejectedData?.length ?? 0
        });

        if (findError) {
          console.error('❌ Error checking rejected submissions:', findError);
          throw new Error(`Failed to check rejected submissions: ${findError.message}`);
        }

        if (rejectedData && rejectedData.length > 0) {
          console.log('📝 Found rejected submission records, attempting to delete them...');
          const { error: rejectedError } = await supabase
            .from('rejected_submissions')
            .delete()
            .eq('original_submission_id', id);

          if (rejectedError) {
            console.error('❌ Error deleting from rejected_submissions:', rejectedError);
            throw new Error(`Failed to delete rejected submission: ${rejectedError.message}`);
          }
          console.log('✅ Successfully deleted rejected submissions records');
        }

        // Then delete from submission_likes table
        console.log('🗑️ Attempting to delete from submission_likes...');
        const { error: likesError } = await supabase
          .from('submission_likes')
          .delete()
          .eq('submission_id', id);

        if (likesError) {
          console.error('❌ Error deleting from submission_likes:', likesError);
          throw new Error(`Failed to delete likes: ${likesError.message}`);
        }
        console.log('✅ Successfully deleted submission likes');

        // Finally delete from submissions table
        console.log('🗑️ Attempting to delete from submissions table...');
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
      console.log('✨ Delete mutation success, invalidating queries for ID:', deletedId);
      
      // Force a complete cache invalidation
      queryClient.invalidateQueries({ 
        queryKey: ['submissions'],
        refetchType: 'all',
        exact: true
      });
      
      // Also remove the specific submission from the cache
      queryClient.setQueryData(['submissions'], (oldData: any) => {
        if (!oldData) return oldData;
        return oldData.filter((submission: any) => submission.id !== deletedId);
      });
      
      toast.success("İçerik başarıyla silindi");
    },
    onError: (error: Error) => {
      console.error('❌ Delete mutation error:', error);
      toast.error("Silme işlemi başarısız: " + error.message);
    }
  });
};