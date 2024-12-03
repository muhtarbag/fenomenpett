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

interface Post {
  id: number;
  username: string;
  image_url: string;
  comment: string;
  likes: number;
}

interface PostDialogContentProps {
  post: Post;
}

const PostDialogContent = ({ post }: PostDialogContentProps) => {
  const { data: posts = [] } = useQuery({
    queryKey: ["approved-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('submissions')
        .select('id, username, image_url, comment, likes')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Find the index of the current post
  const currentIndex = posts.findIndex((p) => p.id === post.id);

  return (
    <div className="grid gap-6">
      <Carousel className="relative" defaultSlide={currentIndex}>
        <CarouselContent>
          {posts.map((post) => (
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
                    <LikeButton postId={post.id} initialLikes={post.likes} />
                    <SocialShare url={window.location.href} />
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute -left-4 right-4 top-1/2 flex -translate-y-1/2 justify-between">
          <CarouselPrevious className="relative translate-y-0 left-0" />
          <CarouselNext className="relative translate-y-0 right-0" />
        </div>
      </Carousel>
    </div>
  );
};

export default PostDialogContent;