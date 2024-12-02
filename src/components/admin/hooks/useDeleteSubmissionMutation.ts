import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useDeleteSubmissionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      console.log('🗑️ Starting deletion process for submission:', id);

      // First delete from submission_likes
      const { error: likesError } = await supabase
        .from('submission_likes')
        .delete()
        .eq('submission_id', id);

      if (likesError) {
        console.error('❌ Error deleting submission likes:', likesError);
        throw new Error('Beğeniler silinirken bir hata oluştu');
      }

      // Delete from rejected_submissions
      const { error: rejectedError } = await supabase
        .from('rejected_submissions')
        .delete()
        .eq('original_submission_id', id);

      if (rejectedError) {
        console.error('❌ Error deleting rejected submission:', rejectedError);
        throw new Error('Reddedilen kayıt silinirken bir hata oluştu');
      }

      // Finally delete the submission itself
      const { error: submissionError } = await supabase
        .from('submissions')
        .delete()
        .eq('id', id);

      if (submissionError) {
        console.error('❌ Error deleting submission:', submissionError);
        throw new Error('Gönderi silinirken bir hata oluştu');
      }

      console.log('✅ Successfully deleted submission and related records:', id);
      return id;
    },
    onSuccess: (deletedId) => {
      console.log('✨ Delete mutation success:', deletedId);
      toast.success("Gönderi başarıyla silindi");
      
      // Update cache to remove the deleted submission
      queryClient.setQueryData(['submissions'], (oldData: any) => {
        if (!oldData) return [];
        return oldData.filter((submission: any) => submission.id !== deletedId);
      });

      // Force a refetch to ensure consistency
      queryClient.invalidateQueries({ 
        queryKey: ['submissions']
      });
    },
    onError: (error: Error) => {
      console.error('❌ Delete mutation error:', error);
      toast.error(error.message || "Silme işlemi başarısız oldu");
    }
  });
};