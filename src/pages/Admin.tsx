import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Clock, FileText } from "lucide-react";
import { DashboardStats } from "@/components/admin/dashboard/DashboardStats";
import { SubmissionsTab } from "@/components/admin/submissions/SubmissionsTab";
import { BlogTab } from "@/components/admin/blog/BlogTab";
import { DownloadButtons } from "@/components/admin/DownloadButtons";
import { TransactionSummary } from "@/components/admin/TransactionSummary";
import { useSubmissions } from "@/components/admin/hooks/useSubmissions";
import { AuthGuard } from "@/components/auth/AuthGuard";

const Admin = () => {
  const { 
    pendingSubmissions, 
    approvedSubmissions, 
    rejectedSubmissions,
  } = useSubmissions();

  return (
    <AuthGuard requireAdmin>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <DashboardStats />

          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Yönetim Paneli</h2>
            <DownloadButtons approvedSubmissions={approvedSubmissions} />
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
              <SubmissionsTab />
            </TabsContent>

            <TabsContent value="blog">
              <BlogTab />
            </TabsContent>
          </Tabs>

          <TransactionSummary 
            pendingCount={pendingSubmissions.length}
            approvedCount={approvedSubmissions.length}
            rejectedCount={rejectedSubmissions.length}
          />
        </div>
      </div>
    </AuthGuard>
  );
};

export default Admin;