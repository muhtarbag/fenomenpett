import { Card } from "@/components/ui/card";
import LikeButton from "./LikeButton";
import SocialShare from "./SocialShare";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import PostDialogContent from "./PostDialogContent";

interface Post {
  id: number;
  username: string;
  image_url: string;
  comment: string;
  likes: number;
  isPlaceholder?: boolean;
}

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="overflow-hidden cursor-pointer hover:opacity-95 transition-opacity">
          <div className="aspect-square relative">
            <img
              src={post.image_url}
              alt={`${post.username} tarafından paylaşılan fotoğraf`}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <img
              src="/lovable-uploads/a06650c0-2ee1-42dd-9217-cef8bdd67039.png"
              alt="FenomenPet Logo"
              className="absolute bottom-3 right-3 w-20 h-auto opacity-70"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">@{post.username}</span>
              <div className="flex items-center gap-4">
                <SocialShare url={window.location.href} />
                <LikeButton 
                  postId={post.id} 
                  initialLikes={post.likes} 
                  isPlaceholder={post.isPlaceholder}
                />
              </div>
            </div>
            <p className="text-gray-600 text-sm">{post.comment}</p>
          </div>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <PostDialogContent post={post} />
      </DialogContent>
    </Dialog>
  );
};

export default PostCard;