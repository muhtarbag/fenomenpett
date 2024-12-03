import { useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useDailyUploads = () => {
  const [dailyUploads, setDailyUploads] = useState(0);

  const calculateDailyUploads = useCallback(async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { count, error } = await supabase
        .from('submissions')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());

      if (error) throw error;
      setDailyUploads(count || 0);
    } catch (error) {
      console.error('Error calculating daily uploads:', error);
    }
  }, []);

  return { dailyUploads, calculateDailyUploads };
};