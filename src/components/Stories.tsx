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

  useInterval(
    () => {
      if (autoPlay && api) {
        api.scrollNext();
      }
    },
    5000
  );

  if (!shuffledStories.length) return null;

  return (
    <div className="w-full mb-8">
      <div className="container mx-auto px-2 sm:px-4">
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
          <CarouselContent className="-ml-2 sm:-ml-4">
            {shuffledStories.map((story) => (
              <StoryItem key={story.id} story={story} />
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};

export default Stories;