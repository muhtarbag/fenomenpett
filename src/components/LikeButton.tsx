import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface LikeButtonProps {
  postId: number;
  initialLikes: number;
  className?: string;
}

const LikeButton = ({ postId, initialLikes, className = "" }: LikeButtonProps) => {
  const [likeCount, setLikeCount] = useState(initialLikes || 0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const checkLikeStatus = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (session?.session?.user?.id) {
        const { data } = await supabase
          .from('submission_likes')
          .select('*')
          .eq('submission_id', postId)
          .eq('user_id', session.session.user.id)
          .single();
        
        setIsLiked(!!data);
      }
    };

    checkLikeStatus();
  }, [postId]);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        // Anonymous like - just increment the count
        const { error } = await supabase
          .from('submissions')
          .update({ likes: likeCount + 1 })
          .eq('id', postId);

        if (error) throw error;
        
        setLikeCount(prev => prev + 1);
        toast.success("Beğeni kaydedildi!");
        return;
      }

      // Authenticated like - record in submission_likes table
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
          .insert([
            { 
              submission_id: postId,
              user_id: session.session.user.id
            }
          ]);

        if (error) throw error;
        
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
        toast.success("Beğeni kaydedildi!");
      }
    } catch (error: any) {
      console.error('Like error:', error);
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
      
      // Revert optimistic update
      if (isLiked) {
        setLikeCount(prev => prev + 1);
        setIsLiked(true);
      } else {
        setLikeCount(prev => Math.max(0, prev - 1));
        setIsLiked(false);
      }
    }
  };

  return (
    <button
      onClick={handleLike}
      className={`flex items-center gap-1 text-gray-600 hover:text-primary transition-colors ${className}`}
    >
      <Heart
        size={20}
        className={`transition-colors ${
          isLiked ? "fill-red-500 text-red-500" : ""
        }`}
      />
      <span>{likeCount}</span>
    </button>
  );
};

export default LikeButton;