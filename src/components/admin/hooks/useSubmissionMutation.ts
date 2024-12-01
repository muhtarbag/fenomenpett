import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Submission } from "./useSubmissions";

export const useSubmissionMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: 'approved' | 'rejected' }) => {
      console.log('🔄 Starting submission status update:', { id, status });
      
      const { error, data } = await supabase
        .from('submissions')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select('*');
      
      if (error) {
        console.error('❌ Error updating submission:', error);
        throw new Error(`Failed to update submission: ${error.message}`);
      }
      
      if (!data) {
        console.error('❌ No data returned after update');
        throw new Error('No data returned after update');
      }

      console.log('✅ Successfully updated submission:', data);
      return data as Submission[];
    },
    onSuccess: (data, variables) => {
      const action = variables.status === 'approved' ? 'onaylandı' : 'reddedildi';
      console.log('✨ Mutation success:', { action, data });
      toast.success(`Gönderi ${action}`);
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
    },
    onError: (error: Error) => {
      console.error('❌ Mutation error:', error);
      toast.error("Bir hata oluştu: " + error.message);
    }
  });
};