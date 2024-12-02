import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useDeleteSubmissionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (submissionId: number) => {
      console.log('🗑️ Starting deletion process for submission:', submissionId);

      // First check if submission exists and get its transaction_id
      const { data: existingSubmission, error: fetchError } = await supabase
        .from('submissions')
        .select('transaction_id')
        .eq('id', submissionId)
        .maybeSingle();

      if (fetchError) {
        console.error('❌ Error fetching submission:', fetchError);
        throw new Error('Gönderi bulunamadı');
      }

      if (!existingSubmission) {
        console.error('❌ Submission not found:', submissionId);
        throw new Error('Gönderi bulunamadı');
      }

      console.log('📝 Found submission with transaction ID:', existingSubmission.transaction_id);

      // Delete associated likes
      const { error: likesError } = await supabase
        .from('submission_likes')
        .delete()
        .eq('submission_id', submissionId);

      if (likesError) {
        console.error('❌ Error deleting likes:', likesError);
        throw new Error('Beğeniler silinirken bir hata oluştu');
      }

      console.log('✅ Successfully deleted associated likes');

      // Delete associated rejected submissions
      const { error: rejectedError } = await supabase
        .from('rejected_submissions')
        .delete()
        .eq('original_submission_id', submissionId);

      if (rejectedError) {
        console.error('❌ Error deleting rejected submission:', rejectedError);
        throw new Error('Reddedilen gönderi silinirken bir hata oluştu');
      }

      console.log('✅ Successfully deleted associated rejected submissions');

      // Finally, delete the submission itself
      const { error: submissionError } = await supabase
        .from('submissions')
        .delete()
        .eq('id', submissionId);

      if (submissionError) {
        console.error('❌ Error deleting submission:', submissionError);
        throw new Error('Gönderi silinirken bir hata oluştu');
      }

      console.log('✅ Successfully deleted submission and related records:', submissionId);
      return submissionId;
    },
    onMutate: async (submissionId) => {
      console.log('🔄 Starting optimistic update for deletion:', submissionId);
      
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['submissions'] });

      // Snapshot the previous value
      const previousSubmissions = queryClient.getQueryData(['submissions']);

      // Optimistically update the cache
      queryClient.setQueryData(['submissions'], (old: any[] | undefined) => {
        if (!old) return [];
        return old.filter(submission => submission.id !== submissionId);
      });

      return { previousSubmissions };
    },
    onError: (err, submissionId, context: any) => {
      console.error('❌ Delete mutation error:', err);
      // Rollback to the previous value
      if (context?.previousSubmissions) {
        console.log('🔄 Rolling back cache to previous state');
        queryClient.setQueryData(['submissions'], context.previousSubmissions);
      }
      toast.error(err instanceof Error ? err.message : 'Gönderi silinirken bir hata oluştu');
    },
    onSettled: () => {
      console.log('🔄 Invalidating and refetching submissions query');
      // Force a cache invalidation and refetch
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      queryClient.refetchQueries({ queryKey: ['submissions'] });
    }
  });
};