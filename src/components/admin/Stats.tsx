import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Globe, Clock, Activity, MousePointerClick, ArrowUpRight, Timer, Brain } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface StatItem {
  title: string;
  value: string;
  icon: LucideIcon;
  change: string;
}

export const Stats = () => {
  const [stats, setStats] = useState<StatItem[]>([]);

  useEffect(() => {
    const calculateStats = () => {
      // Performance API'den metrikleri al
      const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
      const pageLoadTime = (navigation.loadEventEnd - navigation.startTime).toFixed(2);
      
      // Kullanıcı etkileşimi metriklerini hesapla
      const interactions = performance.getEntriesByType("event").length;
      const interactionRate = interactions > 0 ? ((interactions / performance.now()) * 100).toFixed(1) : "0";

      // Oturum süresini hesapla
      const sessionDuration = (performance.now() / 1000).toFixed(0);

      const currentStats: StatItem[] = [
        {
          title: "Toplam Ziyaretçi",
          value: sessionStorage.getItem('visitCount') || "1",
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
          value: `${sessionDuration}s`,
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
          value: `${interactionRate}%`,
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
          value: `${pageLoadTime}ms`,
          icon: Timer,
          change: "0%",
        },
        {
          title: "Kullanıcı Etkileşimi",
          value: `${interactions}`,
          icon: Brain,
          change: "0%",
        },
      ];

      setStats(currentStats);
    };

    // Sayfa yüklendiğinde ziyaretçi sayısını artır
    const visitCount = parseInt(sessionStorage.getItem('visitCount') || "0") + 1;
    sessionStorage.setItem('visitCount', visitCount.toString());

    // İlk hesaplama
    calculateStats();

    // Her 5 saniyede bir güncelle
    const interval = setInterval(calculateStats, 5000);

    // Kullanıcı etkileşimlerini izle
    const observer = new PerformanceObserver((list) => {
      calculateStats();
    });
    
    observer.observe({ entryTypes: ["event"] });

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {stats.map((stat) => (
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
      ))}
    </>
  );
};