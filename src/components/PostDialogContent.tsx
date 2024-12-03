import LikeButton from "./LikeButton";
import SocialShare from "./SocialShare";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem,
  CarouselNext,
  CarouselPrevious 
} from "@/components/ui/carousel";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DialogTitle } from "@/components/ui/dialog";
import { Post } from "./PostCard";

interface PostDialogContentProps {
  post: Post;
}

const PostDialogContent = ({ post }: PostDialogContentProps) => {
  const { data: fetchedPosts = [] } = useQuery({
    queryKey: ["approved-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('submissions')
        .select('id, username, image_url, comment, likes')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(post => ({
        ...post,
        isPlaceholder: false
      }));
    },
  });

  // If the post is a placeholder or there are no approved posts, show only the current post
  const displayPosts = post.isPlaceholder || fetchedPosts.length === 0 ? [post] : fetchedPosts;
  
  // Find the index of the current post
  const currentIndex = displayPosts.findIndex((p) => p.id === post.id);

  return (
    <div className="grid gap-6">
      <DialogTitle className="sr-only">
        Fotoğraf Detayları - @{post.username}
      </DialogTitle>
      
      <Carousel className="relative" opts={{ startIndex: Math.max(0, currentIndex) }}>
        <CarouselContent>
          {displayPosts.map((post) => (
            <CarouselItem key={post.id}>
              <div className="space-y-6">
                <div className="relative">
                  <img
                    src={post.image_url}
                    alt={`${post.username} tarafından paylaşıldı`}
                    className="w-full rounded-lg object-contain max-h-[60vh]"
                    loading="lazy"
                    decoding="async"
                  />
                  <img
                    src="/lovable-uploads/a06650c0-2ee1-42dd-9217-cef8bdd67039.png"
                    alt="FenomenPet Logo"
                    className="absolute bottom-4 right-4 w-[22%] sm:w-[25%] md:w-[22%] lg:w-[20%] h-auto opacity-85"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg mb-4">@{post.username}</h3>
                  <p className="text-gray-600">{post.comment}</p>
                  <div className="mt-6 flex items-center justify-center gap-4">
                    <LikeButton 
                      postId={post.id} 
                      initialLikes={post.likes} 
                      isPlaceholder={post.isPlaceholder}
                    />
                    <SocialShare url={window.location.href} />
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {displayPosts.length > 1 && (
          <div className="absolute -left-4 right-4 top-1/2 flex -translate-y-1/2 justify-between">
            <CarouselPrevious className="relative translate-y-0 left-0" />
            <CarouselNext className="relative translate-y-0 right-0" />
          </div>
        )}
      </Carousel>
    </div>
  );
};

export default PostDialogContent;