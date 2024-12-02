import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import PostDialogContent from "./PostDialogContent";

interface Story {
  id: number;
  username: string;
  image_url: string;
  comment: string;
  likes: number;
}

const Stories = () => {
  const [shuffledStories, setShuffledStories] = useState<Story[]>([]);

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

  if (!shuffledStories.length) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 mb-8">
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {shuffledStories.map((story) => (
          <Dialog key={story.id}>
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
        ))}
      </div>
    </div>
  );
};

export default Stories;