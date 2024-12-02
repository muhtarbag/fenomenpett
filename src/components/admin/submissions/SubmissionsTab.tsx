import { useState } from "react";
import { DateRange } from "react-day-picker";
import { useSubmissions } from "../hooks/useSubmissions";
import { SearchFilters } from "../filters/SearchFilters";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, Clock } from "lucide-react";
import { isWithinInterval, startOfDay, endOfDay, parseISO } from "date-fns";
import { SubmissionsList } from "./SubmissionsList";

const ITEMS_PER_PAGE = 50;

export const SubmissionsTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<DateRange>();
  const [currentPage, setCurrentPage] = useState(1);
  
  const { 
    pendingSubmissions, 
    approvedSubmissions, 
    rejectedSubmissions,
    isLoading
  } = useSubmissions();

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

  const handleTabChange = () => {
    setCurrentPage(1);
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
        usernames={[...new Set([
          ...pendingSubmissions,
          ...approvedSubmissions,
          ...rejectedSubmissions
        ].map(s => s.username))]}
      />

      <Tabs defaultValue="pending" className="w-full" onValueChange={handleTabChange}>
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
          <SubmissionsList
            submissions={sortedPendingSubmissions}
            isLoading={isLoading}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </TabsContent>

        <TabsContent value="approved">
          <SubmissionsList
            submissions={sortedApprovedSubmissions}
            isLoading={isLoading}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </TabsContent>

        <TabsContent value="rejected">
          <SubmissionsList
            submissions={sortedRejectedSubmissions}
            isLoading={isLoading}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </TabsContent>
      </Tabs>
    </>
  );
};