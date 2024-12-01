import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Monitor, Smartphone, Tablet } from "lucide-react";

const deviceData = [
  { 
    device: "Desktop",
    browser: "Chrome",
    version: "121.0.0",
    os: "Windows 11",
    sessions: 2345,
    icon: Monitor
  },
  {
    device: "Mobile",
    browser: "Safari",
    version: "17.3.1",
    os: "iOS 17",
    sessions: 1876,
    icon: Smartphone
  },
  {
    device: "Tablet",
    browser: "Chrome",
    version: "121.0.0",
    os: "iPadOS 17",
    sessions: 654,
    icon: Tablet
  },
  {
    device: "Desktop",
    browser: "Firefox",
    version: "123.0",
    os: "macOS 14",
    sessions: 987,
    icon: Monitor
  },
  {
    device: "Mobile",
    browser: "Chrome",
    version: "121.0.0",
    os: "Android 14",
    sessions: 1234,
    icon: Smartphone
  }
];

export const DeviceStats = () => {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Device & Browser Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Device</TableHead>
              <TableHead>Browser</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>OS</TableHead>
              <TableHead>Sessions</TableHead>
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
                <TableCell>{item.sessions.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};