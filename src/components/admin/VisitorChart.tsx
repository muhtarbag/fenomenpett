import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer } from "recharts";

const data = [
  { date: "Mon", visitors: 124 },
  { date: "Tue", visitors: 186 },
  { date: "Wed", visitors: 245 },
  { date: "Thu", visitors: 203 },
  { date: "Fri", visitors: 228 },
  { date: "Sat", visitors: 312 },
  { date: "Sun", visitors: 289 },
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
              <Line type="monotone" dataKey="visitors" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};