import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Submission } from "./useSubmissions";

export const useDeleteSubmissionMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      console.log('🗑️ Deleting submission:', id);
      
      // Önce rejected_submissions tablosundan silme işlemi
      if (id) {
        const { error: rejectedError } = await supabase
          .from('rejected_submissions')
          .delete()
          .eq('original_submission_id', id);
        
        if (rejectedError) {
          console.error('❌ Error deleting from rejected_submissions:', rejectedError);
          throw rejectedError;
        }
      }
      
      // Sonra submissions tablosundan silme işlemi
      const { error, data } = await supabase
        .from('submissions')
        .delete()
        .eq('id', id)
        .select('*, status:status::text')
        .returns<Submission[]>();
      
      if (error) {
        console.error('❌ Error deleting submission:', error);
        throw error;
      }
      
      console.log('✅ Successfully deleted submission:', data);
      return data;
    },
    onSuccess: () => {
      console.log('✨ Delete mutation success');
      toast.success('Gönderi başarıyla silindi');
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
    },
    onError: (error: Error) => {
      console.error('❌ Delete mutation error:', error);
      toast.error("Silme işlemi başarısız: " + error.message);
    }
  });
};