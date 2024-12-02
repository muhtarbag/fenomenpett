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
          
          if (payload.eventType === 'UPDATE' && payload.new.status !== payload.old.status) {
            const status = payload.new.status === 'approved' ? 'onaylandı' : 'reddedildi';
            toast.success(`Gönderi ${status}`);
            
            console.log(`📊 Post status changed:`, {
              id: payload.new.id,
              oldStatus: payload.old.status,
              newStatus: payload.new.status,
              timestamp: new Date().toISOString()
            });
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
      
      console.log('✅ Fetched submissions:', data);
      
      return (data || []) as Submission[];
    }
  });

  if (isError) {
    console.error('❌ Error in submissions hook:', error);
    toast.error("Gönderiler yüklenirken bir hata oluştu");
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