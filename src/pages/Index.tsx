import { useState } from "react";
import { Heart, Share2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface Post {
  id: number;
  username: string;
  imageUrl: string;
  comment: string;
  likes: number;
}

const Index = () => {
  // In a real app, this would fetch from an API
  const { data: posts = [] } = useQuery<Post[]>({
    queryKey: ["approved-posts"],
    queryFn: () =>
      Promise.resolve([
        {
          id: 1,
          username: "animal_lover",
          imageUrl: "https://images.unsplash.com/photo-1415369629372-26f2fe60c467",
          comment: "Gave water to this sweet stray cat today!",
          likes: 42,
        },
        {
          id: 2,
          username: "pet_friend",
          imageUrl: "https://images.unsplash.com/photo-1548681528-6a5c45b66b42",
          comment: "Found this hungry dog and gave him some food.",
          likes: 38,
        },
      ]),
  });

  const handleLike = (postId: number) => {
    toast.success("Thank you for showing support!");
  };

  const handleShare = (postId: number) => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">
          Stray Animal Care Photos
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-md overflow-hidden animate-fade-up"
            >
              <img
                src={post.imageUrl}
                alt={`Posted by ${post.username}`}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <p className="font-semibold text-gray-900">@{post.username}</p>
                <p className="text-gray-600 mt-1">{post.comment}</p>
                <div className="mt-4 flex items-center justify-between">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-1 text-gray-600 hover:text-primary transition-colors"
                  >
                    <Heart size={20} />
                    <span>{post.likes}</span>
                  </button>
                  <button
                    onClick={() => handleShare(post.id)}
                    className="flex items-center gap-1 text-gray-600 hover:text-primary transition-colors"
                  >
                    <Share2 size={20} />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No approved posts yet. Be the first to share your stray animal care photo!
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;