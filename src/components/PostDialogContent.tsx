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
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Post } from "./PostCard";

interface PostDialogContentProps {
  post: Post;
}

const PostDialogContent = ({ post }: PostDialogContentProps) => {
  const { data: fetchedPosts = [], isLoading } = useQuery({
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

  if (isLoading) {
    return <div className="text-center py-8">Yükleniyor...</div>;
  }

  const displayPosts = post.isPlaceholder || fetchedPosts.length === 0 ? [post] : fetchedPosts;
  const currentIndex = displayPosts.findIndex((p) => p.id === post.id);

  return (
    <div className="grid gap-6">
      <DialogTitle className="sr-only">
        Fotoğraf Detayları - @{post.username}
      </DialogTitle>
      <DialogDescription className="sr-only">
        {post.username} kullanıcısının paylaştığı fotoğraf ve detayları
      </DialogDescription>
      
      <Carousel 
        className="w-full max-w-3xl mx-auto"
        opts={{ 
          startIndex: Math.max(0, currentIndex),
          align: "center",
          loop: true,
          dragFree: false
        }}
      >
        <CarouselContent>
          {displayPosts.map((post) => (
            <CarouselItem key={post.id}>
              <div className="space-y-6">
                <div className="relative w-full aspect-square">
                  <img
                    src={post.image_url}
                    alt={`${post.username} tarafından paylaşıldı`}
                    className="w-full h-full object-contain"
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
          <>
            <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10" />
            <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10" />
          </>
        )}
      </Carousel>
    </div>
  );
};

export default PostDialogContent;