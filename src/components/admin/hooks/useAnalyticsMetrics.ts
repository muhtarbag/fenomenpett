import { useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface AnalyticsMetrics {
  click_through_rate: number;
  conversion_rate: number;
  user_interactions: number;
  bounce_rate: number;
}

export const useAnalyticsMetrics = () => {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      console.log('📊 Fetching analytics metrics...');
      
      const { data, error: supabaseError } = await supabase
        .rpc('get_analytics_metrics')
        .single();

      if (supabaseError) {
        console.error('❌ Error fetching analytics metrics:', supabaseError);
        setError(supabaseError);
        toast.error("İstatistikler yüklenirken bir hata oluştu");
        return;
      }

      if (!data) {
        console.warn('⚠️ No analytics metrics data received');
        setMetrics({
          click_through_rate: 0,
          conversion_rate: 0,
          user_interactions: 0,
          bounce_rate: 0
        });
        return;
      }

      console.log('✅ Fetched analytics metrics:', data);
      setMetrics(data);
      setError(null);
    } catch (err) {
      console.error('❌ Unexpected error fetching analytics metrics:', err);
      setError(err as Error);
      toast.error("İstatistikler yüklenirken bir hata oluştu");
    }
  }, []);

  return { metrics, error, fetchMetrics };
};