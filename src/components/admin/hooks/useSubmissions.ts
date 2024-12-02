import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Submission {
  id: number;
  username: string;
  image_url: string;
  comment: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
  updated_at: string;
  user_id: string | null;
  likes: number | null;
  image_hash: string | null;
  transaction_id: string;
}

export const useSubmissions = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log('🔄 Setting up realtime subscription');
    
    const channel = supabase
      .channel('submissions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'submissions'
        },
        (payload) => {
          console.log('📡 Realtime update received:', payload);
          
          if (payload.eventType === 'DELETE') {
            console.log('🗑️ Realtime delete event:', payload.old.id);
            queryClient.setQueryData(['submissions'], (oldData: Submission[] | undefined) => {
              if (!oldData) return [];
              return oldData.filter(submission => submission.id !== payload.old.id);
            });
          }
          
          queryClient.invalidateQueries({ queryKey: ['submissions'] });
          
          if (payload.eventType === 'UPDATE' && payload.new.status !== payload.old.status) {
            const status = payload.new.status === 'approved' ? 'onaylandı' : 'reddedildi';
            toast.success(`Gönderi ${status}`);
          }
        }
      )
      .subscribe((status) => {
        console.log('📡 Subscription status:', status);
      });

    return () => {
      console.log('🔄 Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const { data: submissions = [], isError, error, isLoading } = useQuery({
    queryKey: ['submissions'],
    queryFn: async () => {
      console.log('📡 Fetching submissions...');
      
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching submissions:', error);
        throw error;
      }
      
      console.log('✅ Fetched submissions:', data?.length);
      return (data || []) as Submission[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isError) {
    console.error('❌ Error in submissions hook:', error);
  }

  const pendingSubmissions = submissions.filter(s => s.status === 'pending' || !s.status);
  const approvedSubmissions = submissions.filter(s => s.status === 'approved');
  const rejectedSubmissions = submissions.filter(s => s.status === 'rejected');

  console.log('📊 Submissions by status:', {
    pending: pendingSubmissions.length,
    approved: approvedSubmissions.length,
    rejected: rejectedSubmissions.length,
    total: submissions.length
  });

  return {
    pendingSubmissions,
    approvedSubmissions,
    rejectedSubmissions,
    isLoading,
    error
  };
};