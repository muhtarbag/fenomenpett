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
    value: "24,589",
    icon: Users,
    change: "+12%",
  },
  {
    title: "Aktif Kullanıcı",
    value: "1,234",
    icon: Activity,
    change: "+4%",
  },
  {
    title: "Ort. Oturum Süresi",
    value: "4d 32s",
    icon: Clock,
    change: "+8%",
  },
  {
    title: "Hemen Çıkma Oranı",
    value: "24%",
    icon: Globe,
    change: "-2%",
  },
  {
    title: "Tıklama Oranı",
    value: "3.2%",
    icon: MousePointerClick,
    change: "+1.5%",
  },
  {
    title: "Dönüşüm Oranı",
    value: "2.8%",
    icon: ArrowUpRight,
    change: "+0.5%",
  },
  {
    title: "Sayfa Yüklenme Süresi",
    value: "0.8s",
    icon: Timer,
    change: "-12%",
  },
  {
    title: "Kullanıcı Etkileşimi",
    value: "78%",
    icon: Brain,
    change: "+5%",
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
            <p className={`text-xs ${
              stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
            }`}>
              {stat.change} geçen aya göre
            </p>
          </CardContent>
        </Card>
      ))}
    </>
  );
};