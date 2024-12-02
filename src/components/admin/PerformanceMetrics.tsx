import { useCallback, useEffect, useMemo, useState } from "react";
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

  const calculateResourceUsage = useCallback((resourceCount: number): "Low" | "Medium" | "High" => {
    if (resourceCount < 30) return "Low";
    if (resourceCount < 50) return "Medium";
    return "High";
  }, []);

  const measurePagePerformance = useCallback(() => {
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
    const resources = performance.getEntriesByType("resource");
    const loadTime = (navigation.loadEventEnd - navigation.startTime).toFixed(2);
    const resourceCount = resources.length;

    const pages = ["Ana Sayfa", "Gönder Sayfası", "Admin Paneli", "Giriş Sayfası"];
    
    return pages.map(page => ({
      page,
      loadTime: `${loadTime}ms`,
      errorRate: "0%",
      userSatisfaction: "100%",
      resourceUsage: calculateResourceUsage(resourceCount)
    }));
  }, [calculateResourceUsage]);

  useEffect(() => {
    // İlk ölçümü yap
    setPerformanceData(measurePagePerformance());

    // Daha uzun interval ile güncelle
    const interval = setInterval(() => {
      setPerformanceData(measurePagePerformance());
    }, 60000); // 1 dakikada bir güncelle

    return () => clearInterval(interval);
  }, [measurePagePerformance]);

  const resourceUsageStyle = useCallback((usage: "Low" | "Medium" | "High") => {
    const styles = {
      Low: 'bg-green-100 text-green-800',
      Medium: 'bg-yellow-100 text-yellow-800',
      High: 'bg-red-100 text-red-800'
    };
    return `px-2 py-1 rounded-full text-xs ${styles[usage]}`;
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
            {useMemo(() => 
              performanceData.map((data, index) => (
                <TableRow key={index}>
                  <TableCell>{data.page}</TableCell>
                  <TableCell>{data.loadTime}</TableCell>
                  <TableCell>{data.errorRate}</TableCell>
                  <TableCell>{data.userSatisfaction}</TableCell>
                  <TableCell>
                    <span className={resourceUsageStyle(data.resourceUsage)}>
                      {data.resourceUsage}
                    </span>
                  </TableCell>
                </TableRow>
              )),
              [performanceData, resourceUsageStyle]
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};