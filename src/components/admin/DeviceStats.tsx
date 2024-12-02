import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Monitor, Smartphone, Tablet } from "lucide-react";

interface DeviceData {
  device: string;
  browser: string;
  version: string;
  os: string;
  sessions: number;
  icon: typeof Monitor | typeof Smartphone | typeof Tablet;
}

export const DeviceStats = () => {
  const [deviceData, setDeviceData] = useState<DeviceData[]>([]);

  useEffect(() => {
    const detectDevice = () => {
      const ua = navigator.userAgent;
      const browserRegexes = [
        { name: "Chrome", regex: /Chrome\/([0-9.]+)/ },
        { name: "Firefox", regex: /Firefox\/([0-9.]+)/ },
        { name: "Safari", regex: /Version\/([0-9.]+).*Safari/ },
        { name: "Edge", regex: /Edg\/([0-9.]+)/ },
      ];

      let browser = "Unknown";
      let version = "-";
      
      for (const { name, regex } of browserRegexes) {
        const match = ua.match(regex);
        if (match) {
          browser = name;
          version = match[1];
          break;
        }
      }

      const os = navigator.platform;
      
      // Cihaz tipini belirle
      const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(ua);
      const isTablet = /Tablet|iPad/i.test(ua);
      
      let deviceType = "Desktop";
      let deviceIcon = Monitor;
      
      if (isMobile) {
        deviceType = "Mobile";
        deviceIcon = Smartphone;
      } else if (isTablet) {
        deviceType = "Tablet";
        deviceIcon = Tablet;
      }

      const newDeviceData: DeviceData[] = [
        {
          device: deviceType,
          browser,
          version,
          os,
          sessions: 1,
          icon: deviceIcon
        }
      ];

      setDeviceData(newDeviceData);
    };

    detectDevice();
  }, []);

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