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
  const { stories } = useStories();

  useInterval(
    () => {
      if (autoPlay && api) {
        api.scrollNext();
      }
    },
    autoPlay ? 5000 : null
  );

  if (!stories.length) return null;

  return (
    <div className="w-full mb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
          <CarouselContent className="-ml-4">
            {stories.map((story) => (
              <StoryItem key={story.id} story={story} />
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};

export default Stories;