import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Submission } from "./useSubmissions";

export const useDeleteSubmissionMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      console.log('🗑️ Deleting submission:', id);
      
      // First check if submission exists
      const { data: existingSubmission, error: checkError } = await supabase
        .from('submissions')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (checkError) {
        console.error('❌ Error checking submission:', checkError);
        throw checkError;
      }

      if (!existingSubmission) {
        console.log('⚠️ Submission not found, might be already deleted');
        throw new Error('Submission not found');
      }
      
      // Then delete from rejected_submissions if it exists
      const { error: rejectedError } = await supabase
        .from('rejected_submissions')
        .delete()
        .eq('original_submission_id', id);
      
      if (rejectedError) {
        console.error('❌ Error deleting from rejected_submissions:', rejectedError);
        throw rejectedError;
      }

      console.log('✅ Successfully deleted from rejected_submissions');
      
      // Finally delete from submissions
      const { error: submissionError } = await supabase
        .from('submissions')
        .delete()
        .eq('id', id);
      
      if (submissionError) {
        console.error('❌ Error deleting submission:', submissionError);
        throw submissionError;
      }
      
      console.log('✅ Successfully deleted submission');
      return existingSubmission as Submission;
    },
    onSuccess: () => {
      console.log('✨ Delete mutation success');
      toast.success('Gönderi başarıyla silindi');
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
    },
    onError: (error: Error) => {
      console.error('❌ Delete mutation error:', error);
      if (error.message === 'Submission not found') {
        toast.error("Gönderi bulunamadı veya zaten silinmiş");
      } else {
        toast.error("Silme işlemi başarısız: " + error.message);
      }
    }
  });
};