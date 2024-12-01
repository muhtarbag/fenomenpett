import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Submission } from "./useSubmissions";

export const useSubmissionMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation<
    Submission[],
    Error,
    { id: number; status: 'approved' | 'rejected' }
  >({
    mutationFn: async ({ id, status }) => {
      console.log('🔄 Starting submission status update:', { id, status });
      
      const { error, data } = await supabase
        .from('submissions')
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id)
        .select('*, status:status::text')
        .returns<Submission[]>();
      
      if (error) {
        console.error('❌ Error updating submission:', error);
        throw new Error(`Failed to update submission: ${error.message}`);
      }
      
      if (!data || data.length === 0) {
        console.error('❌ No data returned after update');
        throw new Error('No data returned after update');
      }
      
      console.log('✅ Successfully updated submission:', data);
      return data;
    },
    onSuccess: (data, variables) => {
      const action = variables.status === 'approved' ? 'onaylandı' : 'reddedildi';
      console.log('✨ Mutation success:', { action, data });
      toast.success(`Fotoğraf ${action}`);
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
    },
    onError: (error: Error) => {
      console.error('❌ Mutation error:', error);
      toast.error("Bir hata oluştu: " + error.message);
    }
  });
};