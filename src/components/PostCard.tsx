import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import PostDialogContent from "./PostDialogContent";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface PostCardProps {
  post: {
    id: number;
    username: string;
    image_url: string;
    comment: string;
    likes: number;
    created_at: string;
  };
}

const PostCard = ({ post }: PostCardProps) => {
  const timeAgo = formatDistanceToNow(new Date(post.created_at), {
    addSuffix: true,
    locale: tr,
  });

  console.log('🖼️ Rendering PostCard image:', {
    imageUrl: post.image_url,
    username: post.username
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="bg-white rounded-lg shadow-md overflow-hidden animate-fade-up cursor-pointer hover:shadow-lg transition-shadow">
          <div className="relative">
            <img
              src={post.image_url}
              alt={`${post.username} tarafından paylaşıldı`}
              className="w-full h-64 object-cover"
              crossOrigin="anonymous"
              onError={(e) => {
                console.error('❌ Image load error:', post.image_url);
                e.currentTarget.src = '/placeholder.svg';
              }}
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
              <img
                src="/lovable-uploads/10d8a44d-2040-49f8-89cb-eae4de94925a.png"
                alt="Fenomenbet Watermark"
                className="w-3/4 max-w-md"
                crossOrigin="anonymous"
                loading="lazy"
              />
            </div>
          </div>
          <div className="p-4">
            <p className="font-semibold text-gray-900">@{post.username}</p>
            <p className="text-gray-600 mt-1 line-clamp-2">{post.comment}</p>
            <p className="text-sm text-gray-500 mt-2">{timeAgo}</p>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <PostDialogContent post={post} />
      </DialogContent>
    </Dialog>
  );
};

export default PostCard;