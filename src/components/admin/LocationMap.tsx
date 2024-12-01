import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const visitorLocations = [
  { country: "United States", city: "New York", visitors: 1234, ip: "192.168.1.1" },
  { country: "Germany", city: "Berlin", visitors: 856, ip: "192.168.1.2" },
  { country: "Japan", city: "Tokyo", visitors: 645, ip: "192.168.1.3" },
  { country: "Brazil", city: "São Paulo", visitors: 432, ip: "192.168.1.4" },
  { country: "Australia", city: "Sydney", visitors: 321, ip: "192.168.1.5" },
];

export const LocationMap = () => {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Visitor Locations</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Country</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Visitors</TableHead>
              <TableHead>IP</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visitorLocations.map((location, index) => (
              <TableRow key={index}>
                <TableCell>{location.country}</TableCell>
                <TableCell>{location.city}</TableCell>
                <TableCell>{location.visitors}</TableCell>
                <TableCell>{location.ip}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};