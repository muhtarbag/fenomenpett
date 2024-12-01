import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Check, X, Clock } from "lucide-react";
import { VisitorChart } from "@/components/admin/VisitorChart";
import { LocationMap } from "@/components/admin/LocationMap";
import { Stats } from "@/components/admin/Stats";
import { DeviceStats } from "@/components/admin/DeviceStats";
import { PerformanceMetrics } from "@/components/admin/PerformanceMetrics";
import { useSubmissions } from "@/components/admin/hooks/useSubmissions";
import { SubmissionCard } from "@/components/admin/SubmissionCard";

const TransactionSummary = ({ 
  pendingCount, 
  approvedCount, 
  rejectedCount 
}: { 
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}) => (
  <div className="mt-12 p-6 bg-white rounded-lg shadow-md">
    <h2 className="text-2xl font-bold mb-4 text-gray-900">İşlem Özeti</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-4 bg-yellow-50 rounded-lg">
        <h3 className="font-semibold text-yellow-700">Bekleyen</h3>
        <p className="text-2xl font-bold text-yellow-800">{pendingCount}</p>
      </div>
      <div className="p-4 bg-green-50 rounded-lg">
        <h3 className="font-semibold text-green-700">Onaylanan</h3>
        <p className="text-2xl font-bold text-green-800">{approvedCount}</p>
      </div>
      <div className="p-4 bg-red-50 rounded-lg">
        <h3 className="font-semibold text-red-700">Reddedilen</h3>
        <p className="text-2xl font-bold text-red-800">{rejectedCount}</p>
      </div>
    </div>
  </div>
);

const Admin = () => {
  const { 
    pendingSubmissions, 
    approvedSubmissions, 
    rejectedSubmissions,
    isLoading
  } = useSubmissions();

  // Sort submissions by creation date (newest first)
  const sortedPendingSubmissions = [...pendingSubmissions].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  
  const sortedApprovedSubmissions = [...approvedSubmissions].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  
  const sortedRejectedSubmissions = [...rejectedSubmissions].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Stats />
        </div>

        {/* Charts and Maps */}
        <div className="grid grid-cols-1 md:grid-cols-8 gap-4 mb-8">
          <VisitorChart />
          <LocationMap />
        </div>

        {/* Device Stats and Performance Metrics side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <DeviceStats />
          <PerformanceMetrics />
        </div>

        {/* Submissions Management */}
        <h2 className="text-2xl font-bold mb-8">Gönderi Yönetimi</h2>
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock size={16} />
              Bekleyen ({sortedPendingSubmissions.length})
            </TabsTrigger>
            <TabsTrigger value="approved" className="flex items-center gap-2">
              <Check size={16} />
              Onaylanan ({sortedApprovedSubmissions.length})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="flex items-center gap-2">
              <X size={16} />
              Reddedilen ({sortedRejectedSubmissions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            {isLoading ? (
              <div className="text-center">Yükleniyor...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedPendingSubmissions.map((submission) => (
                  <SubmissionCard key={submission.id} submission={submission} />
                ))}
                {sortedPendingSubmissions.length === 0 && (
                  <div className="col-span-full text-center text-gray-500">
                    Bekleyen gönderi bulunmuyor
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="approved">
            {isLoading ? (
              <div className="text-center">Yükleniyor...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedApprovedSubmissions.map((submission) => (
                  <SubmissionCard key={submission.id} submission={submission} />
                ))}
                {sortedApprovedSubmissions.length === 0 && (
                  <div className="col-span-full text-center text-gray-500">
                    Onaylanmış gönderi bulunmuyor
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="rejected">
            {isLoading ? (
              <div className="text-center">Yükleniyor...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedRejectedSubmissions.map((submission) => (
                  <SubmissionCard key={submission.id} submission={submission} />
                ))}
                {sortedRejectedSubmissions.length === 0 && (
                  <div className="col-span-full text-center text-gray-500">
                    Reddedilmiş gönderi bulunmuyor
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <TransactionSummary 
          pendingCount={sortedPendingSubmissions.length}
          approvedCount={sortedApprovedSubmissions.length}
          rejectedCount={sortedRejectedSubmissions.length}
        />
      </div>
    </div>
  );
};

export default Admin;