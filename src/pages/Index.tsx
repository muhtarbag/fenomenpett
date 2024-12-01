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
  const { data: posts = [] } = useQuery<Post[]>({
    queryKey: ["approved-posts"],
    queryFn: () =>
      Promise.resolve([
        {
          id: 1,
          username: "animal_lover",
          imageUrl: "https://images.unsplash.com/photo-1415369629372-26f2fe60c467",
          comment: "Found this sweet stray cat and gave her water and food!",
          likes: 42,
        },
        {
          id: 2,
          username: "pet_friend",
          imageUrl: "https://images.unsplash.com/photo-1548681528-6a5c45b66b42",
          comment: "This hungry dog now has a full belly and lots of love ❤️",
          likes: 38,
        },
        {
          id: 3,
          username: "stray_helper",
          imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba",
          comment: "Met this cutie on my way home, shared my lunch with her",
          likes: 65,
        },
        {
          id: 4,
          username: "cat_rescuer",
          imageUrl: "https://images.unsplash.com/photo-1573865526739-10659fec78a5",
          comment: "Helped this injured cat get medical attention today",
          likes: 89,
        },
        {
          id: 5,
          username: "animal_aid",
          imageUrl: "https://images.unsplash.com/photo-1511044568932-338cba0ad803",
          comment: "Built a shelter for the neighborhood strays",
          likes: 127,
        },
        {
          id: 6,
          username: "kind_soul",
          imageUrl: "https://images.unsplash.com/photo-1494256997604-768d1f608cac",
          comment: "Daily feeding station for street cats in my area",
          likes: 73,
        },
        {
          id: 7,
          username: "helping_paws",
          imageUrl: "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13",
          comment: "Found homes for these three kittens!",
          likes: 156,
        },
        {
          id: 8,
          username: "street_angels",
          imageUrl: "https://images.unsplash.com/photo-1533743983669-94fa5c4338ec",
          comment: "Winter shelter project for stray dogs",
          likes: 92,
        },
        {
          id: 9,
          username: "rescue_team",
          imageUrl: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8",
          comment: "Emergency rescue of this little one during heavy rain",
          likes: 204,
        },
        {
          id: 10,
          username: "pet_guardian",
          imageUrl: "https://images.unsplash.com/photo-1513245543132-31f507417b26",
          comment: "Weekly feeding rounds in the industrial area",
          likes: 167,
        },
        {
          id: 11,
          username: "animal_watch",
          imageUrl: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131",
          comment: "Providing fresh water during the heatwave",
          likes: 145,
        },
        {
          id: 12,
          username: "street_feeder",
          imageUrl: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d",
          comment: "Morning routine: Feeding the neighborhood cats",
          likes: 112,
        },
        {
          id: 13,
          username: "care_provider",
          imageUrl: "https://images.unsplash.com/photo-1519052537078-e6302a4968d4",
          comment: "Got this sweet girl vaccinated today",
          likes: 178,
        },
        {
          id: 14,
          username: "furry_friends",
          imageUrl: "https://images.unsplash.com/photo-1543852786-1cf6624b9987",
          comment: "Built weather-proof feeding stations",
          likes: 234,
        },
        {
          id: 15,
          username: "hope_giver",
          imageUrl: "https://images.unsplash.com/photo-1548546738-8509cb246ed3",
          comment: "Rescued this little one from a drain",
          likes: 198,
        },
        {
          id: 16,
          username: "street_hero",
          imageUrl: "https://images.unsplash.com/photo-1561948955-570b270e7c36",
          comment: "Daily check-up on our street cat colony",
          likes: 143,
        },
        {
          id: 17,
          username: "animal_friend",
          imageUrl: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8",
          comment: "Set up a feeding schedule with neighbors",
          likes: 167,
        },
        {
          id: 18,
          username: "compassion_act",
          imageUrl: "https://images.unsplash.com/photo-1577023311546-cdc07a8454d9",
          comment: "Helped this injured dog get to the vet",
          likes: 221,
        },
        {
          id: 19,
          username: "street_guardian",
          imageUrl: "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13",
          comment: "Regular health checks for our street friends",
          likes: 189,
        },
        {
          id: 20,
          username: "helping_hands",
          imageUrl: "https://images.unsplash.com/photo-1533743983669-94fa5c4338ec",
          comment: "Organizing community feeding programs",
          likes: 156,
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
    <div className="min-h-screen bg-gray-50">
      <div className="relative w-full h-[400px] overflow-hidden">
        <img
          src="/lovable-uploads/7138849c-6a14-4a65-8f76-220e6fc26382.png"
          alt="FenomenPet Banner"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="bg-primary text-white py-3 px-4 text-center">
        <p className="text-sm md:text-base animate-fade-in">
          Help us make a difference! Share your stories of helping stray animals. 🐾
        </p>
      </div>
      
      <div className="py-8">
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
    </div>
  );
};

export default Index;
