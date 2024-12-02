import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts";

const data = [
  { date: "Pzt", visitors: 0, uniqueVisitors: 0 },
  { date: "Sal", visitors: 0, uniqueVisitors: 0 },
  { date: "Çar", visitors: 0, uniqueVisitors: 0 },
  { date: "Per", visitors: 0, uniqueVisitors: 0 },
  { date: "Cum", visitors: 0, uniqueVisitors: 0 },
  { date: "Cmt", visitors: 0, uniqueVisitors: 0 },
  { date: "Paz", visitors: 0, uniqueVisitors: 0 },
];

export const VisitorChart = () => {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Günlük Ziyaretçiler</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="visitors" 
                stroke="#8884d8" 
                name="Toplam Ziyaretçi"
              />
              <Line 
                type="monotone" 
                dataKey="uniqueVisitors" 
                stroke="#82ca9d" 
                name="Tekil Ziyaretçi"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};