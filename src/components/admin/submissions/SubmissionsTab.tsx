import { useState } from "react";
import { DateRange } from "react-day-picker";
import { useSubmissions } from "../hooks/useSubmissions";
import { SearchFilters } from "../filters/SearchFilters";
import { SubmissionCard } from "../SubmissionCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, Clock } from "lucide-react";
import { isWithinInterval, startOfDay, endOfDay, parseISO } from "date-fns";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 100;

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

  const paginateSubmissions = (submissions: any[]) => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return submissions.slice(startIndex, endIndex);
  };

  const renderPagination = (totalItems: number) => {
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 2 && i <= currentPage + 2)
      ) {
        pages.push(i);
      } else if (
        i === currentPage - 3 ||
        i === currentPage + 3
      ) {
        pages.push('ellipsis');
      }
    }

    return (
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
          
          {pages.map((page, index) => (
            page === 'ellipsis' ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={currentPage === page}
                  onClick={() => setCurrentPage(page as number)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          ))}

          <PaginationItem>
            <PaginationNext 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
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

  const paginatedPending = paginateSubmissions(sortedPendingSubmissions);
  const paginatedApproved = paginateSubmissions(sortedApprovedSubmissions);
  const paginatedRejected = paginateSubmissions(sortedRejectedSubmissions);

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

      <Tabs defaultValue="pending" className="w-full" onValueChange={() => setCurrentPage(1)}>
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
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedPending.map((submission) => (
                  <SubmissionCard key={submission.id} submission={submission} />
                ))}
                {paginatedPending.length === 0 && (
                  <div className="col-span-full text-center text-gray-500">
                    Bekleyen gönderi bulunmuyor
                  </div>
                )}
              </div>
              {renderPagination(sortedPendingSubmissions.length)}
            </>
          )}
        </TabsContent>

        <TabsContent value="approved">
          {isLoading ? (
            <div className="text-center">Yükleniyor...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedApproved.map((submission) => (
                  <SubmissionCard key={submission.id} submission={submission} />
                ))}
                {paginatedApproved.length === 0 && (
                  <div className="col-span-full text-center text-gray-500">
                    Onaylanmış gönderi bulunmuyor
                  </div>
                )}
              </div>
              {renderPagination(sortedApprovedSubmissions.length)}
            </>
          )}
        </TabsContent>

        <TabsContent value="rejected">
          {isLoading ? (
            <div className="text-center">Yükleniyor...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedRejected.map((submission) => (
                  <SubmissionCard key={submission.id} submission={submission} />
                ))}
                {paginatedRejected.length === 0 && (
                  <div className="col-span-full text-center text-gray-500">
                    Reddedilmiş gönderi bulunmuyor
                  </div>
                )}
              </div>
              {renderPagination(sortedRejectedSubmissions.length)}
            </>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
};