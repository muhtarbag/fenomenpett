import { Users, Clock, Timer, Upload } from "lucide-react";
import { useCallback, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { StatCard } from "./StatCard";
import { useVisitorCount } from "./hooks/useVisitorCount";
import { useDailyUploads } from "./hooks/useDailyUploads";
import { usePerformanceMetrics } from "./hooks/usePerformanceMetrics";

export const Stats = () => {
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
        title: "Sayfa Yüklenme Süresi",
        value: `${perfMetrics.pageLoadTime}ms`,
        icon: Timer,
        change: "0%",
      },
    ];
  }, [visitorCount, dailyUploads, calculatePerformanceMetrics]);

  useEffect(() => {
    console.log('🔄 Setting up Stats component...');
    
    // Initial fetches
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
          console.log('📊 Analytics event detected, refreshing metrics...');
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
          console.log('📝 Submission change detected, refreshing uploads...');
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
      console.log('🧹 Cleaning up Stats component...');
      clearInterval(interval);
      observer.disconnect();
      channel.unsubscribe();
      submissionsChannel.unsubscribe();
    };
  }, [calculateVisitorCount, calculateDailyUploads, generateStats]);

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