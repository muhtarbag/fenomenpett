import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const performanceData = [
  {
    page: "Homepage",
    loadTime: "0.8s",
    errorRate: "0.12%",
    userSatisfaction: "95%",
    resourceUsage: "Low"
  },
  {
    page: "Submit Page",
    loadTime: "1.2s",
    errorRate: "0.08%",
    userSatisfaction: "92%",
    resourceUsage: "Medium"
  },
  {
    page: "Admin Dashboard",
    loadTime: "1.5s",
    errorRate: "0.15%",
    userSatisfaction: "90%",
    resourceUsage: "High"
  },
  {
    page: "Login Page",
    loadTime: "0.6s",
    errorRate: "0.05%",
    userSatisfaction: "97%",
    resourceUsage: "Low"
  }
];

export const PerformanceMetrics = () => {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Page Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Page</TableHead>
              <TableHead>Load Time</TableHead>
              <TableHead>Error Rate</TableHead>
              <TableHead>User Satisfaction</TableHead>
              <TableHead>Resource Usage</TableHead>
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