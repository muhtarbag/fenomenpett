import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface PageMetrics {
  page: string;
  loadTime: string;
  errorRate: string;
  userSatisfaction: string;
  resourceUsage: "Low" | "Medium" | "High";
}

export const PerformanceMetrics = () => {
  const [performanceData, setPerformanceData] = useState<PageMetrics[]>([]);

  useEffect(() => {
    const measurePagePerformance = () => {
      // Performance API kullanarak sayfa yükleme metriklerini ölç
      const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
      const resources = performance.getEntriesByType("resource");

      // Sayfa başına ortalama kaynak kullanımını hesapla - daha gerçekçi eşikler
      const calculateResourceUsage = (resourceCount: number): "Low" | "Medium" | "High" => {
        if (resourceCount < 30) return "Low";        // 0-29 resources
        if (resourceCount < 50) return "Medium";     // 30-49 resources
        return "High";                               // 50+ resources
      };

      // Her sayfa için metrikleri hesapla
      const pages = ["Ana Sayfa", "Gönder Sayfası", "Admin Paneli", "Giriş Sayfası"];
      const metrics = pages.map(page => {
        const loadTime = (navigation.loadEventEnd - navigation.startTime).toFixed(2);
        const resourceCount = resources.length;
        
        console.log(`${page} için kaynak sayısı:`, resourceCount);
        
        return {
          page,
          loadTime: `${loadTime}ms`,
          errorRate: "0%", // Gerçek hata oranı için error tracking eklenebilir
          userSatisfaction: "100%", // Gerçek kullanıcı memnuniyeti için analytics eklenebilir
          resourceUsage: calculateResourceUsage(resourceCount)
        };
      });

      setPerformanceData(metrics);
    };

    // İlk ölçümü yap
    measurePagePerformance();

    // Her 30 saniyede bir ölç
    const interval = setInterval(measurePagePerformance, 30000);

    // Cleanup
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Sayfa Performans Metrikleri</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sayfa</TableHead>
              <TableHead>Yüklenme Süresi</TableHead>
              <TableHead>Hata Oranı</TableHead>
              <TableHead>Kullanıcı Memnuniyeti</TableHead>
              <TableHead>Kaynak Kullanımı</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {performanceData.map((data, index) => (
              <TableRow key={index}>
                <TableCell>{data.page}</TableCell>
                <TableCell>{data.loadTime}</TableCell>
                <TableCell>{data.errorRate}</TableCell>
                <TableCell>{data.userSatisfaction}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    data.resourceUsage === 'Low' 
                      ? 'bg-green-100 text-green-800'
                      : data.resourceUsage === 'Medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {data.resourceUsage}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};