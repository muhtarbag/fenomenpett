import { useState } from "react";
import { Heart } from "lucide-react";
import SocialShare from "./SocialShare";

interface PostCardProps {
  post: {
    id: number;
    username: string;
    imageUrl: string;
    comment: string;
    likes: number;
  };
}

const PostCard = ({ post }: PostCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-fade-up">
      <img
        src={post.imageUrl}
        alt={`${post.username} tarafından paylaşıldı`}
        className="w-full h-64 object-cover"
      />
      <div className="p-4">
        <p className="font-semibold text-gray-900">@{post.username}</p>
        <p className="text-gray-600 mt-1">{post.comment}</p>
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
  );
};

export default PostCard;