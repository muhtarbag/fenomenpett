import { useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useVisitorCount = () => {
  const [visitorCount, setVisitorCount] = useState(0);

  const calculateVisitorCount = useCallback(async () => {
    try {
      const { count, error } = await supabase
        .from('analytics_events')
        .select('session_id', { count: 'exact', head: true })
        .eq('event_type', 'pageview')
        .filter('created_at', 'gte', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
      
      if (error) throw error;
      setVisitorCount(count || 0);
    } catch (error) {
      console.error('Error calculating visitor count:', error);
    }
  }, []);

  return { visitorCount, calculateVisitorCount };
};