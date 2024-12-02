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
        />
        <img
          src="/lovable-uploads/a06650c0-2ee1-42dd-9217-cef8bdd67039.png"
          alt="FenomenPet Logo"
          className="absolute bottom-2 right-2 w-16 h-auto opacity-70"
        />
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