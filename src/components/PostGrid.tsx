import PostCard from "./PostCard";

interface Post {
  id: number;
  username: string;
  image_url: string;
  comment: string;
  likes: number;
}

interface PostGridProps {
  posts: Post[];
}

const PostGrid = ({ posts }: PostGridProps) => {
  const placeholderPosts = [
    {
      id: -1,
      username: "fenomenpet",
      image_url: "/lovable-uploads/476b664f-c46e-465b-8610-bf7caeabfd8e.png",
      comment: "Sokak kedilerimize mama verirken #Fenomenpet Fenomenbet Pati Dostu",
      likes: 15
    },
    {
      id: -2,
      username: "patidostu",
      image_url: "/lovable-uploads/7138849c-6a14-4a65-8f76-220e6fc26382.png",
      comment: "#Fenomenbet - Fenomenbet Patiler de kazanır! Sokak hayvanlarımızı besliyoruz",
      likes: 12
    },
    {
      id: -3,
      username: "hayvansever",
      image_url: "/lovable-uploads/e4fe31df-b619-4ae9-9d59-d6057f321c83.png",
      comment: "Minik dostlarımızı besledik #Fenomenpet Fenomenbet",
      likes: 8
    }
  ];

  const allPosts = [...posts, ...(posts.length === 0 ? placeholderPosts : [])];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
      {allPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      {allPosts.length === 0 && (
        <div className="col-span-full text-center text-gray-500 mt-8">
          Henüz onaylanmış gönderi yok. Sokak hayvanlarına yardım fotoğrafınızı ilk paylaşan siz olun!
        </div>
      )}
    </div>
  );
};

export default PostGrid;