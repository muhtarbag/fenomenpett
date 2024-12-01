import PostCard from "./PostCard";

interface Post {
  id: number;
  username: string;
  image_url: string;  // Changed from imageUrl to match Supabase schema
  comment: string;
  likes: number;
}

interface PostGridProps {
  posts: Post[];
}

const PostGrid = ({ posts }: PostGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      {posts.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          Henüz onaylanmış gönderi yok. Sokak hayvanlarına yardım fotoğrafınızı ilk paylaşan siz olun!
        </div>
      )}
    </div>
  );
};

export default PostGrid;