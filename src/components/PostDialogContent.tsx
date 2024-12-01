import LikeButton from "./LikeButton";
import SocialShare from "./SocialShare";

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
      <div className="relative">
        <img
          src={post.image_url}
          alt={`${post.username} tarafından paylaşıldı`}
          className="w-full rounded-lg object-contain max-h-[60vh]"
          crossOrigin="anonymous"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
          <img
            src="/lovable-uploads/10d8a44d-2040-49f8-89cb-eae4de94925a.png"
            alt="Fenomenbet Watermark"
            className="w-3/4 max-w-md"
            crossOrigin="anonymous"
          />
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-lg">@{post.username}</h3>
        <p className="text-gray-600 mt-2">{post.comment}</p>
        <div className="mt-4 flex items-center justify-between">
          <LikeButton postId={post.id} initialLikes={post.likes} />
          <SocialShare url={window.location.href} />
        </div>
      </div>
    </div>
  );
};

export default PostDialogContent;