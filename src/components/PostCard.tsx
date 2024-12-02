import { Card } from "@/components/ui/card";
import LikeButton from "./LikeButton";
import SocialShare from "./SocialShare";

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
    <Card className="overflow-hidden">
      <div className="aspect-square relative">
        <img
          src={post.image_url}
          alt={`${post.username} tarafından paylaşılan fotoğraf`}
          className="w-full h-full object-cover"
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
  );
};

export default PostCard;