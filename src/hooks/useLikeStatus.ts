import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useLikeStatus = (postId: number, isPlaceholder: boolean = false) => {
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const checkLikeStatus = async () => {
      if (isPlaceholder) return;
      
      try {
        const { data: session } = await supabase.auth.getSession();
        if (session?.session?.user?.id) {
          const { data, error } = await supabase
            .from('submission_likes')
            .select('*')
            .eq('submission_id', postId)
            .eq('user_id', session.session.user.id)
            .maybeSingle();
          
          if (error) {
            console.error('Error checking like status:', error);
            return;
          }
          
          setIsLiked(!!data);
        } else {
          // Check local storage for anonymous likes
          const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
          setIsLiked(likedPosts.includes(postId));
        }
      } catch (error) {
        console.error('Error checking like status:', error);
      }
    };

    checkLikeStatus();
  }, [postId, isPlaceholder]);

  return { isLiked, setIsLiked };
};