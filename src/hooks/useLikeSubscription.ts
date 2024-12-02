import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

interface SubmissionPayload {
  id: number;
  likes: number;
}

type SubmissionChangesPayload = RealtimePostgresChangesPayload<{
  new: SubmissionPayload;
  old: SubmissionPayload;
}>;

export const useLikeSubscription = (postId: number, isPlaceholder: boolean = false) => {
  const [likeCount, setLikeCount] = useState<number>(0);

  useEffect(() => {
    if (isPlaceholder) return;

    console.log('🔄 Setting up realtime subscription for likes on post:', postId);
    
    const channel = supabase
      .channel(`likes_${postId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'submissions',
          filter: `id=eq.${postId}`
        },
        (payload: SubmissionChangesPayload) => {
          console.log('📡 Realtime like update received:', payload);
          if (payload.new && typeof payload.new.likes === 'number') {
            setLikeCount(payload.new.likes);
          }
        }
      )
      .subscribe((status) => {
        console.log(`📡 Like subscription status for post ${postId}:`, status);
      });

    return () => {
      console.log('🔄 Cleaning up likes subscription for post:', postId);
      supabase.removeChannel(channel);
    };
  }, [postId, isPlaceholder]);

  return { likeCount, setLikeCount };
};