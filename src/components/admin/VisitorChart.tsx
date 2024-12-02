import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts";

interface VisitorData {
  date: string;
  visitors: number;
  uniqueVisitors: number;
}

export const VisitorChart = () => {
  const [data, setData] = useState<VisitorData[]>([]);

  useEffect(() => {
    const generateInitialData = () => {
      const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
      const today = new Date().getDay();
      
      // Ziyaretçi verilerini simüle et
      return days.map((day, index) => {
        const isToday = (index + 1) % 7 === today;
        const baseVisitors = isToday ? 1 : 0;
        
        return {
          date: day,
          visitors: baseVisitors,
          uniqueVisitors: baseVisitors
        };
      });
    };

    const updateVisitorData = () => {
      const visitCount = parseInt(sessionStorage.getItem('visitCount') || "1");
      const today = new Date().getDay();
      
      setData(prevData => 
        prevData.map((item, index) => {
          if ((index + 1) % 7 === today) {
            return {
              ...item,
              visitors: visitCount,
              uniqueVisitors: 1 // Tek kullanıcı olduğu için
            };
          }
          return item;
        })
      );
    };

    // İlk veriyi oluştur
    setData(generateInitialData());

    // Her 5 saniyede bir güncelle
    const interval = setInterval(updateVisitorData, 5000);

    return () => clearInterval(interval);
  }, []);

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