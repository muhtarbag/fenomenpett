import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

interface LikeButtonProps {
  postId: number;
  initialLikes: number;
  className?: string;
  isPlaceholder?: boolean;
}

interface SubmissionPayload {
  id: number;
  likes: number;
}

const LikeButton = ({ postId, initialLikes, className = "", isPlaceholder = false }: LikeButtonProps) => {
  const [likeCount, setLikeCount] = useState(initialLikes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Set up realtime subscription for likes
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
        (payload: RealtimePostgresChangesPayload<SubmissionPayload>) => {
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

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isPlaceholder) {
      toast.error("Bu bir örnek gönderidir, beğeni yapılamaz.");
      return;
    }

    if (isProcessing) {
      return;
    }

    setIsProcessing(true);
    
    try {
      const { data: session } = await supabase.auth.getSession();
      
      // Handle anonymous likes with local storage
      if (!session?.session?.user) {
        const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
        
        if (likedPosts.includes(postId)) {
          toast.error("Bu gönderiyi zaten beğenmişsiniz.");
          setIsProcessing(false);
          return;
        }

        // First get current likes count
        const { data: submission, error: submissionError } = await supabase
          .from('submissions')
          .select('likes')
          .eq('id', postId)
          .single();

        if (submissionError) {
          toast.error("Bu gönderi artık mevcut değil.");
          setIsProcessing(false);
          return;
        }

        // Update likes count in the database
        const { error: updateError } = await supabase
          .from('submissions')
          .update({ likes: (submission.likes || 0) + 1 })
          .eq('id', postId);

        if (updateError) throw updateError;

        // Update local storage and state
        likedPosts.push(postId);
        localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
        toast.success("Beğeni kaydedildi!");
      } else {
        // Handle authenticated likes
        if (isLiked) {
          const { error } = await supabase
            .from('submission_likes')
            .delete()
            .eq('submission_id', postId)
            .eq('user_id', session.session.user.id);

          if (error) throw error;
          
          setIsLiked(false);
          setLikeCount(prev => Math.max(0, prev - 1));
          toast.success("Beğeni kaldırıldı");
        } else {
          const { error } = await supabase
            .from('submission_likes')
            .insert([{ 
              submission_id: postId,
              user_id: session.session.user.id
            }]);

          if (error) {
            if (error.code === '23505') {
              toast.error("Bu gönderiyi zaten beğenmişsiniz.");
              setIsLiked(true);
              return;
            }
            throw error;
          }
          
          setIsLiked(true);
          setLikeCount(prev => prev + 1);
          toast.success("Beğeni kaydedildi!");
        }
      }
    } catch (error: any) {
      console.error('Like error:', error);
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isProcessing}
      className={`flex items-center gap-1 text-red-500 hover:text-red-600 transition-colors ${
        isProcessing ? 'opacity-50' : ''
      } ${className}`}
    >
      <Heart
        size={20}
        className={`${isLiked ? 'fill-red-500 text-red-500' : ''}`}
      />
      <span className="text-red-500">{likeCount}</span>
    </button>
  );
};

export default LikeButton;