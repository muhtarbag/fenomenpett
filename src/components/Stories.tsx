import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import PostDialogContent from "./PostDialogContent";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useInterval } from "@/hooks/use-interval";

interface Story {
  id: number;
  username: string;
  image_url: string;
  comment: string;
  likes: number;
}

const Stories: React.FC = () => {
  const [shuffledStories, setShuffledStories] = useState<Story[]>([]);
  const [api, setApi] = useState<CarouselApi>();
  const [autoPlay, setAutoPlay] = useState(true);

  const { data: stories = [] } = useQuery({
    queryKey: ["top-stories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('submissions')
        .select('id, username, image_url, comment, likes')
        .eq('status', 'approved')
        .order('likes', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Add placeholder stories if there are no real stories
      if (!data || data.length === 0) {
        return [
          {
            id: -1,
            username: "patidostu",
            image_url: "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd",
            comment: "Sokak hayvanlarına mama dağıtımı #Fenomenpet",
            likes: 45
          },
          {
            id: -2,
            username: "hayvansever",
            image_url: "https://images.unsplash.com/photo-1548767797-d8c844163c4c",
            comment: "Minik dostlarımızı besledik #Fenomenbet",
            likes: 38
          },
          {
            id: -3,
            username: "fenomenpet",
            image_url: "https://images.unsplash.com/photo-1611611158876-41699b77a059",
            comment: "Sokak kedilerimize mama verirken #Fenomenpet",
            likes: 32
          },
          {
            id: -4,
            username: "patisever",
            image_url: "https://images.unsplash.com/photo-1574158622682-e40e69881006",
            comment: "Köpek dostlarımıza yemek dağıttık #Fenomenbet",
            likes: 29
          },
          {
            id: -5,
            username: "hayvankoruma",
            image_url: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e",
            comment: "Kedi dostlarımızı unutmadık #Fenomenpet",
            likes: 27
          },
          {
            id: -6,
            username: "sokakhayvanlari",
            image_url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba",
            comment: "Mama dağıtımı devam ediyor #Fenomenbet",
            likes: 25
          },
          {
            id: -7,
            username: "patidostlari",
            image_url: "https://images.unsplash.com/photo-1573865526739-10659fec78a5",
            comment: "Sokak hayvanlarına yardım #Fenomenpet",
            likes: 23
          },
          {
            id: -8,
            username: "kedisever",
            image_url: "https://images.unsplash.com/photo-1519052537078-e6302a4968d4",
            comment: "Kedilerimize mama dağıtımı #Fenomenbet",
            likes: 21
          },
          {
            id: -9,
            username: "kopeksever",
            image_url: "https://images.unsplash.com/photo-1544568100-847a948585b9",
            comment: "Köpeklerimize mama dağıtımı #Fenomenpet",
            likes: 19
          },
          {
            id: -10,
            username: "hayvandostu",
            image_url: "https://images.unsplash.com/photo-1533743983669-94fa5c4338ec",
            comment: "Sokak hayvanlarına yardım #Fenomenbet",
            likes: 17
          },
          {
            id: -11,
            username: "patiyardim",
            image_url: "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13",
            comment: "Minik dostlarımıza yardım #Fenomenpet",
            likes: 15
          }
        ];
      }

      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    // Shuffle stories when component mounts or stories change
    const shuffleStories = () => {
      const shuffled = [...stories].sort(() => Math.random() - 0.5);
      setShuffledStories(shuffled);
    };

    shuffleStories();
  }, [stories]);

  // Auto-advance stories every 5 seconds
  useInterval(
    () => {
      if (autoPlay && api) {
        api.scrollNext();
      }
    },
    5000 // 5 seconds interval
  );

  if (!shuffledStories.length) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 mb-8">
      <Carousel
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
        setApi={setApi}
        onMouseEnter={() => setAutoPlay(false)}
        onMouseLeave={() => setAutoPlay(true)}
      >
        <CarouselContent className="flex gap-4">
          {shuffledStories.map((story) => (
            <CarouselItem key={story.id} className="basis-auto">
              <Dialog>
                <DialogTrigger asChild>
                  <div className="flex flex-col items-center gap-1 cursor-pointer min-w-[72px]">
                    <div className="rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 to-fuchsia-600">
                      <Avatar className="w-16 h-16 border-2 border-white">
                        <AvatarImage src={story.image_url} alt={story.username} />
                      </Avatar>
                    </div>
                    <span className="text-xs text-gray-600 truncate max-w-[72px]">
                      @{story.username}
                    </span>
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <PostDialogContent post={story} />
                </DialogContent>
              </Dialog>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default Stories;