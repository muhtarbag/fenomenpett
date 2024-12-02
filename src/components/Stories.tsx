import React, { useState } from "react";
import {
  Carousel,
  CarouselContent,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useInterval } from "@/hooks/use-interval";
import StoryItem from "./stories/StoryItem";
import { useStories } from "./stories/useStories";

const Stories: React.FC = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [autoPlay, setAutoPlay] = useState(true);
  const { shuffledStories } = useStories();

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
            <StoryItem key={story.id} story={story} />
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default Stories;