import { useState } from "react";
import { DateRange } from "react-day-picker";
import { useSubmissions } from "../hooks/useSubmissions";
import { SearchFilters } from "../filters/SearchFilters";
import { SubmissionCard } from "../SubmissionCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, Clock } from "lucide-react";
import { isWithinInterval, startOfDay, endOfDay, parseISO } from "date-fns";

export const SubmissionsTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<DateRange>();
  
  const { 
    pendingSubmissions, 
    approvedSubmissions, 
    rejectedSubmissions,
    isLoading
  } = useSubmissions();

  const allUsernames = Array.from(new Set([
    ...pendingSubmissions, 
    ...approvedSubmissions, 
    ...rejectedSubmissions
  ].map(submission => submission.username)));

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
    <>
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
    </>
  );
};