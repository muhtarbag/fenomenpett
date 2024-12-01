import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import SocialShare from "./SocialShare";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

interface Post {
  id: number;
  username: string;
  image_url: string;
  comment: string;
  likes: number;
}

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [isLiked, setIsLiked] = useState(false);

  // Check if the current session has liked this post
  useEffect(() => {
    const checkLikeStatus = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (session?.session?.user?.id) {
        const { data } = await supabase
          .from('submission_likes')
          .select('*')
          .eq('submission_id', post.id)
          .eq('user_id', session.session.user.id)
          .single();
        
        setIsLiked(!!data);
      }
    };

    checkLikeStatus();
  }, [post.id]);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        // Anonymous like - just increment the count
        const { error } = await supabase
          .from('submissions')
          .update({ likes: likeCount + 1 })
          .eq('id', post.id);

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
          .eq('submission_id', post.id)
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
              submission_id: post.id,
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
    <Dialog>
      <DialogTrigger asChild>
        <div className="bg-white rounded-lg shadow-md overflow-hidden animate-fade-up cursor-pointer hover:shadow-lg transition-shadow">
          <img
            src={post.image_url}
            alt={`${post.username} tarafından paylaşıldı`}
            className="w-full h-64 object-cover"
          />
          <div className="p-4">
            <p className="font-semibold text-gray-900">@{post.username}</p>
            <p className="text-gray-600 mt-1 line-clamp-2">{post.comment}</p>
            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={handleLike}
                className="flex items-center gap-1 text-gray-600 hover:text-primary transition-colors"
              >
                <Heart
                  size={20}
                  className={`transition-colors ${
                    isLiked ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                <span>{likeCount}</span>
              </button>
              <div onClick={(e) => e.stopPropagation()}>
                <SocialShare url={window.location.href} />
              </div>
            </div>
          </div>
        </div>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[800px]">
        <div className="grid gap-6">
          <img
            src={post.image_url}
            alt={`${post.username} tarafından paylaşıldı`}
            className="w-full rounded-lg object-contain max-h-[60vh]"
          />
          <div>
            <h3 className="font-semibold text-lg">@{post.username}</h3>
            <p className="text-gray-600 mt-2">{post.comment}</p>
            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={handleLike}
                className="flex items-center gap-1 text-gray-600 hover:text-primary transition-colors"
              >
                <Heart
                  size={20}
                  className={`transition-colors ${
                    isLiked ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                <span>{likeCount}</span>
              </button>
              <SocialShare url={window.location.href} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostCard;