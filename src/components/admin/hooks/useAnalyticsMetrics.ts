import { useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface AnalyticsMetrics {
  click_through_rate: number;
  conversion_rate: number;
  user_interactions: number;
  bounce_rate: number;
}

export const useAnalyticsMetrics = () => {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      const { data, error } = await supabase.rpc('get_analytics_metrics');
      if (error) throw error;
      setMetrics(data[0]);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  }, []);

  return { metrics, fetchMetrics };
};