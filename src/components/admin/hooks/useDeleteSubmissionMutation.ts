import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useDeleteSubmissionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      console.log('🗑️ Starting deletion process for submission:', id);

      try {
        // First delete from submission_likes
        console.log('🔍 Deleting from submission_likes:', id);
        const { error: likesError } = await supabase
          .from('submission_likes')
          .delete()
          .eq('submission_id', id);

        if (likesError) {
          console.error('❌ Error deleting submission likes:', likesError);
          throw new Error(`Failed to delete likes: ${likesError.message}`);
        }
        console.log('✅ Deleted submission likes');

        // Delete from rejected_submissions
        console.log('🔍 Deleting from rejected_submissions:', id);
        const { error: rejectedError } = await supabase
          .from('rejected_submissions')
          .delete()
          .eq('original_submission_id', id);

        if (rejectedError) {
          console.error('❌ Error deleting rejected submissions:', rejectedError);
          throw new Error(`Failed to delete rejected submissions: ${rejectedError.message}`);
        }
        console.log('✅ Deleted rejected submissions');

        // Finally delete the submission itself
        console.log('🔍 Deleting submission:', id);
        const { error: submissionError } = await supabase
          .from('submissions')
          .delete()
          .eq('id', id);

        if (submissionError) {
          console.error('❌ Error deleting submission:', submissionError);
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
      
      // Immediately update cache to remove the deleted submission
      queryClient.setQueryData(['submissions'], (oldData: any) => {
        if (!oldData) return [];
        console.log('🔄 Updating cache, removing submission:', deletedId);
        const newData = oldData.filter((submission: any) => submission.id !== deletedId);
        console.log('📊 New cache size:', newData.length);
        return newData;
      });

      // Force a refetch to ensure consistency
      queryClient.invalidateQueries({ 
        queryKey: ['submissions']
      });
      
      toast.success("Gönderi başarıyla silindi");
    },
    onError: (error: Error) => {
      console.error('❌ Delete mutation error:', error);
      toast.error("Silme işlemi başarısız: " + error.message);
    }
  });
};