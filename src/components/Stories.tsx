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
  CarouselNext,
  CarouselPrevious,
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
  const [currentIndex, setCurrentIndex] = useState(0);
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
      return data || [];
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
      if (autoPlay && shuffledStories.length > 0) {
        setCurrentIndex((prevIndex) =>
          prevIndex === shuffledStories.length - 1 ? 0 : prevIndex + 1
        );
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
        onMouseEnter={() => setAutoPlay(false)}
        onMouseLeave={() => setAutoPlay(true)}
        value={currentIndex}
        onValueChange={setCurrentIndex}
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