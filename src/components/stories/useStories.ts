import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import type { Story } from "./types";
import { PLACEHOLDER_STORIES } from "./types";

export const useStories = () => {
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

      if (!data || data.length === 0) {
        return PLACEHOLDER_STORIES;
      }

      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    const shuffleStories = () => {
      const shuffled = [...stories].sort(() => Math.random() - 0.5);
      setShuffledStories(shuffled);
    };

    shuffleStories();
  }, [stories]);

  return { shuffledStories };
};