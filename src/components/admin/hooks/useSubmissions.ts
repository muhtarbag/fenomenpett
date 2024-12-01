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
            
            // Log the status change
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

  const { data: submissions = [], isError, isLoading } = useQuery({
    queryKey: ['submissions'],
    queryFn: async () => {
      console.log('📡 Fetching submissions...');
      const { data, error } = await supabase
        .from('submissions')
        .select('*, status:status::text')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching submissions:', error);
        throw error;
      }
      
      console.log('✅ Raw submissions data:', data);
      
      return (data || []) as Submission[];
    }
  });

  if (isError) {
    console.error('❌ Error in submissions hook');
    toast.error("Gönderiler yüklenirken bir hata oluştu");
  }

  const pendingSubmissions = submissions.filter(s => !s.status || s.status === 'pending');
  const approvedSubmissions = submissions.filter(s => s.status === 'approved');
  const rejectedSubmissions = submissions.filter(s => s.status === 'rejected');

  // Log the sorting results
  console.log('📊 Submissions by status:', {
    pending: pendingSubmissions.map(s => ({ id: s.id, created_at: s.created_at })),
    approved: approvedSubmissions.map(s => ({ id: s.id, created_at: s.created_at })),
    rejected: rejectedSubmissions.map(s => ({ id: s.id, created_at: s.created_at }))
  });

  return {
    pendingSubmissions,
    approvedSubmissions,
    rejectedSubmissions,
    isLoading
  };
};