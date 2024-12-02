import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Globe, Clock, Activity, MousePointerClick, ArrowUpRight, Timer, Brain } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface StatItem {
  title: string;
  value: string;
  icon: LucideIcon;
  change: string;
}

const stats: StatItem[] = [
  {
    title: "Toplam Ziyaretçi",
    value: "0",
    icon: Users,
    change: "0%",
  },
  {
    title: "Aktif Kullanıcı",
    value: "0",
    icon: Activity,
    change: "0%",
  },
  {
    title: "Ort. Oturum Süresi",
    value: "0s",
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
    value: "0%",
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
    value: "0s",
    icon: Timer,
    change: "0%",
  },
  {
    title: "Kullanıcı Etkileşimi",
    value: "0%",
    icon: Brain,
    change: "0%",
  },
];

export const Stats = () => {
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