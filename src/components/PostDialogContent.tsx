import LikeButton from "./LikeButton";
import SocialShare from "./SocialShare";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem,
  CarouselNext,
  CarouselPrevious 
} from "@/components/ui/carousel";

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
  return (
    <div className="grid gap-6">
      <Carousel className="relative">
        <CarouselContent>
          <CarouselItem>
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
          </CarouselItem>
          <CarouselItem>
            <div className="flex flex-col justify-center items-center h-full p-4 text-center">
              <h3 className="font-semibold text-lg mb-4">@{post.username}</h3>
              <p className="text-gray-600">{post.comment}</p>
              <div className="mt-6 flex items-center gap-4">
                <LikeButton postId={post.id} initialLikes={post.likes} />
                <SocialShare url={window.location.href} />
              </div>
            </div>
          </CarouselItem>
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