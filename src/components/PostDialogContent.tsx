import LikeButton from "./LikeButton";
import SocialShare from "./SocialShare";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PostDialogContentProps {
  post: {
    id: number;
    username: string;
    image_url: string;
    comment: string;
    likes: number;
  };
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
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const currentIndex = posts.findIndex((p) => p.id === post.id);

  return (
    <div className="flex flex-col items-center w-full">
      <DialogTitle className="sr-only">
        Paylaşım Detayları
      </DialogTitle>
      <DialogDescription className="sr-only">
        Kullanıcıların sokak hayvanlarına yardım fotoğrafları
      </DialogDescription>
      
      <Carousel className="w-full max-w-3xl mx-auto relative" opts={{ loop: true }}>
        <CarouselContent>
          {posts.map((post) => (
            <CarouselItem key={post.id} className="flex justify-center">
              <div className="w-full max-w-2xl mx-auto">
                <div className="space-y-6">
                  <div className="relative aspect-[4/3] w-full flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
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
                  <div className="px-4">
                    <h3 className="font-semibold text-lg">@{post.username}</h3>
                    <p className="text-gray-600 mt-2">{post.comment}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <LikeButton postId={post.id} initialLikes={post.likes} />
                      <SocialShare url={window.location.href} />
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10">
          <CarouselPrevious className="h-8 w-8 rounded-full bg-white/80 hover:bg-white" />
        </div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
          <CarouselNext className="h-8 w-8 rounded-full bg-white/80 hover:bg-white" />
        </div>
      </Carousel>
    </div>
  );
};

export default PostDialogContent;