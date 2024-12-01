import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Check, X, Clock, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VisitorChart } from "@/components/admin/VisitorChart";
import { LocationMap } from "@/components/admin/LocationMap";
import { Stats } from "@/components/admin/Stats";
import { DeviceStats } from "@/components/admin/DeviceStats";
import { PerformanceMetrics } from "@/components/admin/PerformanceMetrics";
import { useSubmissions } from "@/components/admin/hooks/useSubmissions";
import { SubmissionCard } from "@/components/admin/SubmissionCard";
import { BlogPostForm } from "@/components/admin/BlogPostForm";
import { BlogPostList } from "@/components/admin/BlogPostList";
import { toast } from "sonner";

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

  const sortedPendingSubmissions = [...pendingSubmissions].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  
  const sortedApprovedSubmissions = [...approvedSubmissions].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  
  const sortedRejectedSubmissions = [...rejectedSubmissions].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const downloadApprovedUsernames = () => {
    try {
      // Format date and extract data from approved submissions
      const submissionData = approvedSubmissions.map(sub => ({
        username: sub.username,
        date: new Date(sub.created_at).toLocaleString('tr-TR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })
      }));
      
      // Create CSV content with headers
      const csvContent = "Kullanıcı Adı,Gönderim Tarihi\n" + 
        submissionData.map(data => `${data.username},${data.date}`).join("\n");
      
      // Create blob and download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      
      // Create download URL
      const url = window.URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "onaylanan-kullanicilar.csv");
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("CSV dosyası başarıyla indirildi");
    } catch (error) {
      console.error('CSV indirme hatası:', error);
      toast.error("CSV dosyası indirilirken bir hata oluştu");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
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

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Yönetim Paneli</h2>
          <Button
            onClick={downloadApprovedUsernames}
            className="flex items-center gap-2"
            variant="outline"
          >
            <Download className="h-4 w-4" />
            Onaylanan Kullanıcıları İndir
          </Button>
        </div>

        <Tabs defaultValue="submissions" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="submissions" className="flex items-center gap-2">
              <Clock size={16} />
              Gönderiler
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex items-center gap-2">
              <FileText size={16} />
              Blog Yazıları
            </TabsTrigger>
          </TabsList>

          <TabsContent value="submissions">
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
          </TabsContent>

          <TabsContent value="blog">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Yeni Blog Yazısı</h3>
                <BlogPostForm />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Blog Yazıları</h3>
                <BlogPostList />
              </div>
            </div>
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