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
    <CarouselItem className="basis-auto">
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
  );
};

export default StoryItem;