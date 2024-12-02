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

      // Finally, delete the submission itself - removed .select() and .single()
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
      await queryClient.cancelQueries({ queryKey: ['submissions'] });
      const previousData = queryClient.getQueryData(['submissions']);
      
      queryClient.setQueryData(['submissions'], (old: any[] | undefined) => {
        if (!old) return [];
        return old.filter(submission => submission.id !== submissionId);
      });

      return { previousData };
    },
    onError: (err, _, context) => {
      console.error('❌ Delete mutation error:', err);
      if (context?.previousData) {
        queryClient.setQueryData(['submissions'], context.previousData);
      }
      toast.error(err instanceof Error ? err.message : 'Gönderi silinirken bir hata oluştu');
    },
    onSuccess: (submissionId) => {
      console.log('✅ Successfully deleted submission:', submissionId);
      toast.success('Gönderi başarıyla silindi');
      
      // Immediately update all related queries
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      queryClient.refetchQueries({ queryKey: ['submissions'] });
    }
  });
};