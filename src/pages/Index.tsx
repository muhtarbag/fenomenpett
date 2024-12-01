import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import Banner from "@/components/Banner";
import PostGrid from "@/components/PostGrid";
import { Link } from "react-router-dom";

const Index = () => {
  const { data: posts = [] } = useQuery({
    queryKey: ["approved-posts"],
    queryFn: () =>
      Promise.resolve([
        {
          id: 1,
          username: "hayvan_sever",
          imageUrl: "https://images.unsplash.com/photo-1415369629372-26f2fe60c467?fm=webp",
          comment: "Bu tatlı sokak kedisini buldum ve ona su ve mama verdim!",
          likes: 42,
        },
        {
          id: 2,
          username: "pati_dostu",
          imageUrl: "https://images.unsplash.com/photo-1548681528-6a5c45b66b42?fm=webp",
          comment: "Bu aç köpeğin karnı artık tok ve sevgiyle dolu ❤️",
          likes: 38,
        },
        {
          id: 3,
          username: "stray_helper",
          imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?fm=webp",
          comment: "Met this cutie on my way home, shared my lunch with her",
          likes: 65,
        },
        {
          id: 4,
          username: "cat_rescuer",
          imageUrl: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?fm=webp",
          comment: "Helped this injured cat get medical attention today",
          likes: 89,
        },
        {
          id: 5,
          username: "animal_aid",
          imageUrl: "https://images.unsplash.com/photo-1511044568932-338cba0ad803?fm=webp",
          comment: "Built a shelter for the neighborhood strays",
          likes: 127,
        },
        {
          id: 6,
          username: "kind_soul",
          imageUrl: "https://images.unsplash.com/photo-1494256997604-768d1f608cac?fm=webp",
          comment: "Daily feeding station for street cats in my area",
          likes: 73,
        },
        {
          id: 7,
          username: "helping_paws",
          imageUrl: "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?fm=webp",
          comment: "Found homes for these three kittens!",
          likes: 156,
        },
        {
          id: 8,
          username: "street_angels",
          imageUrl: "https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?fm=webp",
          comment: "Winter shelter project for stray dogs",
          likes: 92,
        },
        {
          id: 9,
          username: "rescue_team",
          imageUrl: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?fm=webp",
          comment: "Emergency rescue of this little one during heavy rain",
          likes: 204,
        },
        {
          id: 10,
          username: "pet_guardian",
          imageUrl: "https://images.unsplash.com/photo-1513245543132-31f507417b26?fm=webp",
          comment: "Weekly feeding rounds in the industrial area",
          likes: 167,
        },
        {
          id: 11,
          username: "animal_watch",
          imageUrl: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?fm=webp",
          comment: "Providing fresh water during the heatwave",
          likes: 145,
        },
        {
          id: 12,
          username: "street_feeder",
          imageUrl: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?fm=webp",
          comment: "Morning routine: Feeding the neighborhood cats",
          likes: 112,
        },
        {
          id: 13,
          username: "care_provider",
          imageUrl: "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?fm=webp",
          comment: "Got this sweet girl vaccinated today",
          likes: 178,
        },
        {
          id: 14,
          username: "furry_friends",
          imageUrl: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?fm=webp",
          comment: "Built weather-proof feeding stations",
          likes: 234,
        },
        {
          id: 15,
          username: "hope_giver",
          imageUrl: "https://images.unsplash.com/photo-1548546738-8509cb246ed3?fm=webp",
          comment: "Rescued this little one from a drain",
          likes: 198,
        },
        {
          id: 16,
          username: "street_hero",
          imageUrl: "https://images.unsplash.com/photo-1561948955-570b270e7c36?fm=webp",
          comment: "Daily check-up on our street cat colony",
          likes: 143,
        },
        {
          id: 17,
          username: "animal_friend",
          imageUrl: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?fm=webp",
          comment: "Set up a feeding schedule with neighbors",
          likes: 167,
        },
        {
          id: 18,
          username: "compassion_act",
          imageUrl: "https://images.unsplash.com/photo-1577023311546-cdc07a8454d9?fm=webp",
          comment: "Helped this injured dog get to the vet",
          likes: 221,
        },
        {
          id: 19,
          username: "street_guardian",
          imageUrl: "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?fm=webp",
          comment: "Regular health checks for our street friends",
          likes: 189,
        },
        {
          id: 20,
          username: "helping_hands",
          imageUrl: "https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?fm=webp",
          comment: "Organizing community feeding programs",
          likes: 156,
        },
      ]),
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Banner />
      
      <div className="bg-primary text-white py-3 px-4 text-center">
        <p className="text-sm md:text-base animate-fade-in">
          Fark yaratmamıza yardım edin! Sokak hayvanlarına yardım hikayelerinizi paylaşın. 🐾
        </p>
      </div>
      
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <a href="https://linkany.pro/fenomenbet" target="_blank" rel="noopener noreferrer">
              <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg rounded-lg">
                Fenomenbet Giriş
              </Button>
            </a>
          </div>
          
          <PostGrid posts={posts} />
        </div>
      </div>
    </div>
  );
};

export default Index;
