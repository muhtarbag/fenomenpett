import { DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Post } from "./PostCard";
import LikeButton from "./LikeButton";
import SocialShare from "./SocialShare";

interface PostDialogContentProps {
  post: Post;
}

const PostDialogContent = ({ post }: PostDialogContentProps) => {
  return (
    <div className="grid gap-6">
      <DialogTitle className="sr-only">
        Fotoğraf Detayları - @{post.username}
      </DialogTitle>
      <DialogDescription className="sr-only">
        {post.username} kullanıcısının paylaştığı fotoğraf ve detayları
      </DialogDescription>
      
      <div className="space-y-6">
        <div className="relative w-full aspect-square">
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
        <div className="text-center">
          <h3 className="font-semibold text-lg mb-4">@{post.username}</h3>
          <p className="text-gray-600">{post.comment}</p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <LikeButton 
              postId={post.id} 
              initialLikes={post.likes} 
              isPlaceholder={post.isPlaceholder}
            />
            <SocialShare url={window.location.href} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDialogContent;