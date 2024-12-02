import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Globe, Clock, Activity, MousePointerClick, ArrowUpRight, Timer, Brain } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

interface StatItem {
  title: string;
  value: string;
  icon: LucideIcon;
  change: string;
}

export const Stats = () => {
  const [stats, setStats] = useState<StatItem[]>([]);

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
  const generateStats = useCallback((metrics: ReturnType<typeof calculatePerformanceMetrics>) => {
    const visitCount = parseInt(sessionStorage.getItem('visitCount') || "1");
    
    return [
      {
        title: "Toplam Ziyaretçi",
        value: visitCount.toString(),
        icon: Users,
        change: "0%",
      },
      {
        title: "Aktif Kullanıcı",
        value: "1",
        icon: Activity,
        change: "0%",
      },
      {
        title: "Ort. Oturum Süresi",
        value: `${metrics.sessionDuration}s`,
        icon: Clock,
        change: "0%",
      },
      {
        title: "Hemen Çıkma Oranı",
        value: "0%",
        icon: Globe,
        change: "0%",
      },
      {
        title: "Tıklama Oranı",
        value: `${metrics.interactionRate}%`,
        icon: MousePointerClick,
        change: "0%",
      },
      {
        title: "Dönüşüm Oranı",
        value: "0%",
        icon: ArrowUpRight,
        change: "0%",
      },
      {
        title: "Sayfa Yüklenme Süresi",
        value: `${metrics.pageLoadTime}ms`,
        icon: Timer,
        change: "0%",
      },
      {
        title: "Kullanıcı Etkileşimi",
        value: `${metrics.interactions}`,
        icon: Brain,
        change: "0%",
      },
    ];
  }, []);

  useEffect(() => {
    // Ziyaretçi sayısını artır
    const visitCount = parseInt(sessionStorage.getItem('visitCount') || "0") + 1;
    sessionStorage.setItem('visitCount', visitCount.toString());

    // İlk hesaplama
    const metrics = calculatePerformanceMetrics();
    setStats(generateStats(metrics));

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
    };
  }, [calculatePerformanceMetrics, generateStats]);

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