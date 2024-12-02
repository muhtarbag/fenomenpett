import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useDeleteSubmissionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (submissionId: number) => {
      console.log('🗑️ Starting deletion process for submission:', submissionId);

      // First check if submission exists
      const { data: existingSubmission, error: checkError } = await supabase
        .from('submissions')
        .select('id')
        .eq('id', submissionId)
        .maybeSingle();

      console.log('Checking submission existence:', { existingSubmission, checkError });

      if (checkError) {
        console.error('❌ Error checking submission:', checkError);
        throw new Error('Gönderi kontrol edilirken bir hata oluştu');
      }

      if (!existingSubmission) {
        console.error('❌ Submission not found:', submissionId);
        throw new Error('Gönderi bulunamadı veya zaten silinmiş');
      }

      // First delete associated likes
      const { error: likesError } = await supabase
        .from('submission_likes')
        .delete()
        .eq('submission_id', submissionId);

      console.log('Deleting likes:', { likesError });

      if (likesError) {
        console.error('❌ Error deleting likes:', likesError);
        throw new Error('Beğeniler silinirken bir hata oluştu');
      }

      // Delete associated rejected submissions
      const { error: rejectedError } = await supabase
        .from('rejected_submissions')
        .delete()
        .eq('original_submission_id', submissionId);

      console.log('Deleting rejected submissions:', { rejectedError });

      if (rejectedError) {
        console.error('❌ Error deleting rejected submission:', rejectedError);
        throw new Error('Reddedilen gönderi silinirken bir hata oluştu');
      }

      // Finally, delete the submission itself
      const { error: submissionError } = await supabase
        .from('submissions')
        .delete()
        .eq('id', submissionId);

      console.log('Deleting submission:', { submissionError });

      if (submissionError) {
        console.error('❌ Error deleting submission:', submissionError);
        throw new Error('Gönderi silinirken bir hata oluştu');
      }

      console.log('✅ Successfully deleted submission:', submissionId);
      return submissionId;
    },
    onSuccess: (submissionId) => {
      console.log('✅ Successfully deleted submission:', submissionId);
      toast.success('Gönderi başarıyla silindi');
      
      // Force a complete cache refresh and refetch
      queryClient.removeQueries({ queryKey: ['submissions'] });
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      queryClient.refetchQueries({ queryKey: ['submissions'] });
    },
    onError: (err) => {
      console.error('❌ Delete mutation error:', err);
      toast.error(err instanceof Error ? err.message : 'Gönderi silinirken bir hata oluştu');
    }
  });
};