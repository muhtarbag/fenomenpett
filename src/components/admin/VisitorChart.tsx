import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts";

const data = [
  { date: "Mon", visitors: 124, uniqueVisitors: 98 },
  { date: "Tue", visitors: 186, uniqueVisitors: 145 },
  { date: "Wed", visitors: 245, uniqueVisitors: 187 },
  { date: "Thu", visitors: 203, uniqueVisitors: 156 },
  { date: "Fri", visitors: 228, uniqueVisitors: 178 },
  { date: "Sat", visitors: 312, uniqueVisitors: 234 },
  { date: "Sun", visitors: 289, uniqueVisitors: 213 },
];

export const VisitorChart = () => {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Daily Visitors</CardTitle>
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
                name="Total Visitors"
              />
              <Line 
                type="monotone" 
                dataKey="uniqueVisitors" 
                stroke="#82ca9d" 
                name="Unique Visitors"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};