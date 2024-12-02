import React from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import PostDialogContent from "../PostDialogContent";
import { CarouselItem } from "@/components/ui/carousel";
import type { Story } from "./types";

interface StoryItemProps {
  story: Story;
}

const StoryItem: React.FC<StoryItemProps> = ({ story }) => {
  return (
    <CarouselItem className="pl-2 md:pl-3 basis-[100px] md:basis-[110px]">
      <Dialog>
        <DialogTrigger asChild>
          <div className="flex flex-col items-center gap-2 cursor-pointer min-w-[90px] md:min-w-[100px]">
            <div className="rounded-full p-[3px] bg-gradient-to-tr from-yellow-400 to-fuchsia-600">
              <Avatar className="w-[85px] h-[85px] md:w-[90px] md:h-[90px] border-2 border-white">
                <AvatarImage src={story.image_url} alt={story.username} />
              </Avatar>
            </div>
            <span className="text-sm text-gray-600 truncate w-full text-center">
              @{story.username}
            </span>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <PostDialogContent post={story} />
        </DialogContent>
      </Dialog>
    </CarouselItem>
  );
};

export default StoryItem;