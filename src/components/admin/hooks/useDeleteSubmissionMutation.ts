import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Submission } from "./useSubmissions";

export const useDeleteSubmissionMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      console.log('🗑️ Starting deletion process for submission:', id);
      
      try {
        // First check if the submission exists
        const { data: submission, error: checkError } = await supabase
          .from('submissions')
          .select('*')
          .eq('id', id)
          .single();

        if (checkError) {
          console.error('❌ Error checking submission:', checkError);
          throw new Error('Gönderi kontrol edilirken bir hata oluştu');
        }

        // Delete from rejected_submissions first
        const { error: rejectedError } = await supabase
          .from('rejected_submissions')
          .delete()
          .eq('original_submission_id', id);

        if (rejectedError) {
          console.error('❌ Error deleting from rejected_submissions:', rejectedError);
          throw new Error('Reddedilen gönderi silinirken bir hata oluştu');
        }

        console.log('✅ Successfully deleted from rejected_submissions');

        // Then delete from main submissions table
        const { error: submissionError } = await supabase
          .from('submissions')
          .delete()
          .eq('id', id);

        if (submissionError) {
          console.error('❌ Error deleting from submissions:', submissionError);
          throw new Error('Gönderi silinirken bir hata oluştu');
        }

        console.log('✅ Successfully deleted submission:', id);
        return submission;

      } catch (error) {
        console.error('❌ Delete operation failed:', error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log('✨ Delete mutation success');
      toast.success('Gönderi başarıyla silindi');
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
    },
    onError: (error: Error) => {
      console.error('❌ Delete mutation error:', error);
      toast.error(error.message || "Silme işlemi başarısız oldu");
    }
  });
};