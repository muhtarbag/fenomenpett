import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Submission } from "./useSubmissions";

export const useDeleteSubmissionMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Submission[], Error, number>({
    mutationFn: async (id) => {
      console.log('🗑️ Deleting submission:', id);
      
      const { error, data } = await supabase
        .from('submissions')
        .delete()
        .eq('id', id)
        .select();
      
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