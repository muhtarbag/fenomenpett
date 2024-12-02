import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Monitor, Smartphone, Tablet } from "lucide-react";

const deviceData = [
  { 
    device: "Desktop",
    browser: "-",
    version: "-",
    os: "-",
    sessions: 0,
    icon: Monitor
  },
  {
    device: "Mobile",
    browser: "-",
    version: "-",
    os: "-",
    sessions: 0,
    icon: Smartphone
  },
  {
    device: "Tablet",
    browser: "-",
    version: "-",
    os: "-",
    sessions: 0,
    icon: Tablet
  }
];

export const DeviceStats = () => {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Cihaz & Tarayıcı İstatistikleri</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cihaz</TableHead>
              <TableHead>Tarayıcı</TableHead>
              <TableHead>Versiyon</TableHead>
              <TableHead>OS</TableHead>
              <TableHead>Oturum</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deviceData.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  {item.device}
                </TableCell>
                <TableCell>{item.browser}</TableCell>
                <TableCell>{item.version}</TableCell>
                <TableCell>{item.os}</TableCell>
                <TableCell>{item.sessions}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};