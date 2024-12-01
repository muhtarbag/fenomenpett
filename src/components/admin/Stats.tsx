import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Globe, Clock, Activity } from "lucide-react";

const stats = [
  {
    title: "Total Visitors",
    value: "24,589",
    icon: Users,
    change: "+12%",
  },
  {
    title: "Active Users",
    value: "1,234",
    icon: Activity,
    change: "+4%",
  },
  {
    title: "Avg. Session",
    value: "4m 32s",
    icon: Clock,
    change: "+8%",
  },
  {
    title: "Bounce Rate",
    value: "24%",
    icon: Globe,
    change: "-2%",
  },
];

export const Stats = () => {
  return (
    <>
      {stats.map((stat, index) => (
        <Card key={index}>
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
              {stat.change} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </>
  );
};