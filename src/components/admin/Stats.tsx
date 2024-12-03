import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Globe, Clock, Activity, MousePointerClick, ArrowUpRight, Timer, Brain, Upload } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface StatItem {
  title: string;
  value: string;
  icon: LucideIcon;
  change: string;
}

interface AnalyticsMetrics {
  click_through_rate: number;
  conversion_rate: number;
  user_interactions: number;
  bounce_rate: number;
}

export const Stats = () => {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [visitorCount, setVisitorCount] = useState(0);
  const [dailyUploads, setDailyUploads] = useState(0);

  // Fetch analytics metrics
  const fetchMetrics = useCallback(async () => {
    try {
      const { data, error } = await supabase.rpc('get_analytics_metrics');
      if (error) throw error;
      setMetrics(data[0]);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  }, []);

  // Ziyaretçi sayısını hesapla
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

  // Günlük yüklenen içerik sayısını hesapla
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

  // Performans metriklerini hesaplama fonksiyonunu memoize edelim
  const calculatePerformanceMetrics = useCallback(() => {
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
    const pageLoadTime = (navigation.loadEventEnd - navigation.startTime).toFixed(2);
    const interactions = performance.getEntriesByType("event").length;
    const interactionRate = interactions > 0 ? ((interactions / performance.now()) * 100).toFixed(1) : "0";
    const sessionDuration = (performance.now() / 1000).toFixed(0);

    return {
      pageLoadTime,
      interactions,
      interactionRate,
      sessionDuration
    };
  }, []);

  // Stats array'ini memoize edelim
  const generateStats = useCallback((perfMetrics: ReturnType<typeof calculatePerformanceMetrics>) => {
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
  }, [metrics, visitorCount, dailyUploads]);

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
          // Refresh metrics and visitor count when new events come in
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

    // İlk hesaplama
    const perfMetrics = calculatePerformanceMetrics();
    setStats(generateStats(perfMetrics));

    // Performans gözlemcisi
    const observer = new PerformanceObserver(() => {
      const updatedMetrics = calculatePerformanceMetrics();
      setStats(generateStats(updatedMetrics));
    });
    
    observer.observe({ entryTypes: ["event"] });

    // Periyodik güncelleme için daha uzun bir interval kullanalım
    const interval = setInterval(() => {
      const updatedMetrics = calculatePerformanceMetrics();
      setStats(generateStats(updatedMetrics));
    }, 10000); // 10 saniyede bir güncelle

    return () => {
      clearInterval(interval);
      observer.disconnect();
      channel.unsubscribe();
      submissionsChannel.unsubscribe();
    };
  }, [calculatePerformanceMetrics, generateStats, fetchMetrics, calculateVisitorCount, calculateDailyUploads]);

  return (
    <>
      {useMemo(() => 
        stats.map((stat) => (
          <Card key={stat.title} className="animate-fade-up">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change} geçen aya göre
              </p>
            </CardContent>
          </Card>
        )),
        [stats]
      )}
    </>
  );
};