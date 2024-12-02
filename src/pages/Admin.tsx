import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Check, X, Clock, FileText } from "lucide-react";
import { VisitorChart } from "@/components/admin/VisitorChart";
import { LocationMap } from "@/components/admin/LocationMap";
import { Stats } from "@/components/admin/Stats";
import { DeviceStats } from "@/components/admin/DeviceStats";
import { PerformanceMetrics } from "@/components/admin/PerformanceMetrics";
import { useSubmissions } from "@/components/admin/hooks/useSubmissions";
import { SubmissionCard } from "@/components/admin/SubmissionCard";
import { BlogPostForm } from "@/components/admin/BlogPostForm";
import { BlogPostList } from "@/components/admin/BlogPostList";
import { DownloadButtons } from "@/components/admin/DownloadButtons";
import { SearchFilters } from "@/components/admin/filters/SearchFilters";
import { TransactionSummary } from "@/components/admin/TransactionSummary";
import { useState, useMemo } from "react";
import { DateRange } from "react-day-picker";
import { isWithinInterval, startOfDay, endOfDay, parseISO } from "date-fns";

const Admin = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<DateRange>();
  
  const { 
    pendingSubmissions, 
    approvedSubmissions, 
    rejectedSubmissions,
    isLoading
  } = useSubmissions();

  const allUsernames = useMemo(() => {
    const usernames = new Set<string>();
    [...pendingSubmissions, ...approvedSubmissions, ...rejectedSubmissions]
      .forEach(submission => usernames.add(submission.username));
    return Array.from(usernames);
  }, [pendingSubmissions, approvedSubmissions, rejectedSubmissions]);

  const filterSubmissions = (submissions: any[]) => {
    return submissions.filter(submission => {
      const matchesSearch = !searchQuery || 
        submission.username.toLowerCase().includes(searchQuery.toLowerCase());
      
      const submissionDate = parseISO(submission.created_at);
      const matchesDateRange = !dateRange?.from || !dateRange?.to || 
        isWithinInterval(submissionDate, {
          start: startOfDay(dateRange.from),
          end: endOfDay(dateRange.to)
        });
      
      return matchesSearch && matchesDateRange;
    });
  };

  const sortedPendingSubmissions = filterSubmissions([...pendingSubmissions].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  ));
  
  const sortedApprovedSubmissions = filterSubmissions([...approvedSubmissions].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  ));
  
  const sortedRejectedSubmissions = filterSubmissions([...rejectedSubmissions].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  ));

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
          <DownloadButtons approvedSubmissions={sortedApprovedSubmissions} />
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
            <SearchFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              usernames={allUsernames}
            />

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