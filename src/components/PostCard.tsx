import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import LikeButton from "./LikeButton";
import SocialShare from "./SocialShare";
import PostDialogContent from "./PostDialogContent";

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
              <div onClick={(e) => e.stopPropagation()}>
                <LikeButton postId={post.id} initialLikes={post.likes} />
              </div>
              <div onClick={(e) => e.stopPropagation()}>
                <SocialShare url={window.location.href} />
              </div>
            </div>
          </div>
        </div>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[800px]">
        <PostDialogContent post={post} />
      </DialogContent>
    </Dialog>
  );
};

export default PostCard;