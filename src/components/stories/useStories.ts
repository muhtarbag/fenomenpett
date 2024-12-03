import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Story } from "./types";
import { PLACEHOLDER_STORIES } from "./types";

export const useStories = () => {
  const { data: stories = [] } = useQuery({
    queryKey: ["top-stories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('submissions')
        .select('id, username, image_url, comment, likes')
        .eq('status', 'approved')
        .order('likes', { ascending: false })
        .limit(12);

      if (error) throw error;

      if (!data || data.length === 0) {
        return PLACEHOLDER_STORIES.slice(0, 12);
      }

      // Shuffle the stories once when they're fetched
      return [...data].sort(() => Math.random() - 0.5);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return { stories };
};