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
  rejection_reason?: string;
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
          queryClient.invalidateQueries({ queryKey: ['submissions'] });
          queryClient.refetchQueries({ queryKey: ['submissions'] });
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
        .order('created_at', { ascending: true }); // Changed to ascending order
      
      if (error) {
        console.error('❌ Error fetching submissions:', error);
        throw error;
      }
      
      console.log('✅ Fetched submissions:', {
        total: data?.length,
        pending: data?.filter(s => s.status === 'pending' || !s.status).length,
        approved: data?.filter(s => s.status === 'approved').length,
        rejected: data?.filter(s => s.status === 'rejected').length
      });
      
      return (data || []) as Submission[];
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchInterval: 5000,
  });

  if (isError) {
    console.error('❌ Error in submissions hook:', error);
    toast.error("Gönderiler yüklenirken bir hata oluştu");
  }

  // Sort pending submissions by creation date (oldest first)
  const pendingSubmissions = submissions
    .filter(s => s.status === 'pending' || !s.status)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  // Sort approved submissions by approval date (newest first)
  const approvedSubmissions = submissions
    .filter(s => s.status === 'approved')
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

  // Sort rejected submissions by rejection date (newest first)
  const rejectedSubmissions = submissions
    .filter(s => s.status === 'rejected')
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

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