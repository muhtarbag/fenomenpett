import { Users, Globe, Clock, Activity, MousePointerClick, ArrowUpRight, Timer, Brain, Upload } from "lucide-react";
import { useCallback, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { StatCard } from "./StatCard";
import { useAnalyticsMetrics } from "./hooks/useAnalyticsMetrics";
import { useVisitorCount } from "./hooks/useVisitorCount";
import { useDailyUploads } from "./hooks/useDailyUploads";
import { usePerformanceMetrics } from "./hooks/usePerformanceMetrics";

export const Stats = () => {
  const { metrics, fetchMetrics } = useAnalyticsMetrics();
  const { visitorCount, calculateVisitorCount } = useVisitorCount();
  const { dailyUploads, calculateDailyUploads } = useDailyUploads();
  const calculatePerformanceMetrics = usePerformanceMetrics();

  const generateStats = useCallback(() => {
    const perfMetrics = calculatePerformanceMetrics();
    
    return [
      {
        title: "Toplam Ziyaretçi",
        value: visitorCount.toString(),
        icon: Users,
        change: "0%",
      },
      {
        title: "Günlük İçerik",
        value: dailyUploads.toString(),
        icon: Upload,
        change: "0%",
      },
      {
        title: "Ort. Oturum Süresi",
        value: `${perfMetrics.sessionDuration}s`,
        icon: Clock,
        change: "0%",
      },
      {
        title: "Hemen Çıkma Oranı",
        value: metrics ? `${metrics.bounce_rate.toFixed(1)}%` : "0%",
        icon: Globe,
        change: "0%",
      },
      {
        title: "Tıklama Oranı",
        value: metrics ? `${metrics.click_through_rate.toFixed(1)}%` : "0%",
        icon: MousePointerClick,
        change: "0%",
      },
      {
        title: "Dönüşüm Oranı",
        value: metrics ? `${metrics.conversion_rate.toFixed(1)}%` : "0%",
        icon: ArrowUpRight,
        change: "0%",
      },
      {
        title: "Sayfa Yüklenme Süresi",
        value: `${perfMetrics.pageLoadTime}ms`,
        icon: Timer,
        change: "0%",
      },
      {
        title: "Kullanıcı Etkileşimi",
        value: metrics ? metrics.user_interactions.toString() : "0",
        icon: Brain,
        change: "0%",
      },
    ];
  }, [metrics, visitorCount, dailyUploads, calculatePerformanceMetrics]);

  useEffect(() => {
    // Initial fetches
    fetchMetrics();
    calculateVisitorCount();
    calculateDailyUploads();

    // Subscribe to analytics_events changes
    const channel = supabase.channel('analytics_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'analytics_events'
        },
        () => {
          fetchMetrics();
          calculateVisitorCount();
        }
      )
      .subscribe();

    // Submissions değişikliklerini dinle
    const submissionsChannel = supabase.channel('submissions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'submissions'
        },
        () => {
          calculateDailyUploads();
        }
      )
      .subscribe();

    // Performans gözlemcisi
    const observer = new PerformanceObserver(() => {
      generateStats();
    });
    
    observer.observe({ entryTypes: ["event"] });

    // Periyodik güncelleme
    const interval = setInterval(() => {
      generateStats();
    }, 10000);

    return () => {
      clearInterval(interval);
      observer.disconnect();
      channel.unsubscribe();
      submissionsChannel.unsubscribe();
    };
  }, [fetchMetrics, calculateVisitorCount, calculateDailyUploads, generateStats]);

  return (
    <>
      {useMemo(() => 
        generateStats().map((stat) => (
          <StatCard key={stat.title} {...stat} />
        )),
        [generateStats]
      )}
    </>
  );
};