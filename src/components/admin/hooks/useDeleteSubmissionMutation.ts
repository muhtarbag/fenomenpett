import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useDeleteSubmissionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (submissionId: number) => {
      console.log('🗑️ Starting deletion process for submission:', submissionId);

      // First delete associated likes
      const { error: likesError } = await supabase
        .from('submission_likes')
        .delete()
        .eq('submission_id', submissionId);

      if (likesError) {
        console.error('❌ Error deleting likes:', likesError);
        throw new Error('Beğeniler silinirken bir hata oluştu');
      }

      // Delete associated rejected submissions
      const { error: rejectedError } = await supabase
        .from('rejected_submissions')
        .delete()
        .eq('original_submission_id', submissionId);

      if (rejectedError) {
        console.error('❌ Error deleting rejected submission:', rejectedError);
        throw new Error('Reddedilen gönderi silinirken bir hata oluştu');
      }

      // Finally, delete the submission itself
      const { error: submissionError } = await supabase
        .from('submissions')
        .delete()
        .eq('id', submissionId);

      if (submissionError) {
        console.error('❌ Error deleting submission:', submissionError);
        throw new Error('Gönderi silinirken bir hata oluştu');
      }

      return submissionId;
    },
    onMutate: async (submissionId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['submissions'] });

      // Snapshot the previous value
      const previousSubmissions = queryClient.getQueryData(['submissions']);

      // Optimistically remove the submission from the cache
      queryClient.setQueryData(['submissions'], (old: any[] | undefined) => {
        if (!old) return [];
        return old.filter(submission => submission.id !== submissionId);
      });

      return { previousSubmissions };
    },
    onError: (err, _, context) => {
      console.error('❌ Delete mutation error:', err);
      // Rollback to the previous value if there's an error
      if (context?.previousSubmissions) {
        queryClient.setQueryData(['submissions'], context.previousSubmissions);
      }
      toast.error(err instanceof Error ? err.message : 'Gönderi silinirken bir hata oluştu');
    },
    onSuccess: (submissionId) => {
      console.log('✅ Successfully deleted submission:', submissionId);
      toast.success('Gönderi başarıyla silindi');
      
      // Force a complete cache refresh
      queryClient.removeQueries({ queryKey: ['submissions'] });
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
    }
  });
};