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
          username: "demo_user",
          imageUrl: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba",
          comment: "Beautiful sunset!",
          likes: 42,
        },
      ]),
  });

  const handleLike = (postId: number) => {
    toast.success("Liked!");
  };

  const handleShare = (postId: number) => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">Photo Stream</h1>
        
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
      </div>
    </div>
  );
};

export default Index;