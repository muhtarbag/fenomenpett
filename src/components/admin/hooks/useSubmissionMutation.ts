import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Submission } from "./useSubmissions";

export const useSubmissionMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      status, 
      reason 
    }: { 
      id: number; 
      status: 'approved' | 'rejected';
      reason?: string;
    }) => {
      console.log('🔄 Starting submission status update:', { id, status, reason });
      
      const { error: submissionError, data: submissionData } = await supabase
        .from('submissions')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select('*');
      
      if (submissionError) {
        console.error('❌ Error updating submission:', submissionError);
        throw new Error(`Failed to update submission: ${submissionError.message}`);
      }

      if (status === 'rejected' && reason && submissionData?.[0]) {
        const { error: rejectionError } = await supabase
          .from('rejected_submissions')
          .insert({
            username: submissionData[0].username,
            image_url: submissionData[0].image_url,
            comment: submissionData[0].comment,
            reason: reason,
            original_submission_id: id,
            image_hash: submissionData[0].image_hash
          });

        if (rejectionError) {
          console.error('❌ Error creating rejection record:', rejectionError);
          throw new Error(`Failed to create rejection record: ${rejectionError.message}`);
        }
      }
      
      if (!submissionData) {
        console.error('❌ No data returned after update');
        throw new Error('No data returned after update');
      }

      console.log('✅ Successfully updated submission:', submissionData);
      return submissionData as Submission[];
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