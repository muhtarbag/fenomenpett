import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useSubmissionMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: 'approved' | 'rejected' }) => {
      console.log('🔄 Updating submission status:', { id, status });
      const { error, data } = await supabase
        .from('submissions')
        .update({ status })
        .eq('id', id)
        .select();
      
      if (error) {
        console.error('❌ Error updating submission:', error);
        throw error;
      }
      console.log('✅ Successfully updated submission:', data);
    },
    onSuccess: (_, variables) => {
      const action = variables.status === 'approved' ? 'onaylandı' : 'reddedildi';
      console.log('✨ Mutation success:', { action });
      toast.success(`Fotoğraf ${action}`);
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
    },
    onError: (error: Error) => {
      console.error('❌ Mutation error:', error);
      toast.error("Bir hata oluştu: " + error.message);
    }
  });
};