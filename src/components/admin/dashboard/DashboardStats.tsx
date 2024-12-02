import { Stats } from "@/components/admin/Stats";
import { VisitorChart } from "@/components/admin/VisitorChart";
import { LocationMap } from "@/components/admin/LocationMap";
import { DeviceStats } from "@/components/admin/DeviceStats";
import { PerformanceMetrics } from "@/components/admin/PerformanceMetrics";

export const DashboardStats = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Stats />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-8 gap-4 mb-8">
        <VisitorChart />
        <LocationMap />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <DeviceStats />
        <PerformanceMetrics />
      </div>
    </>
  );
};