import { useSubmissions } from "./hooks/useSubmissions";
import { PendingSubmissions } from "./submissions/PendingSubmissions";
import { ApprovedSubmissions } from "./submissions/ApprovedSubmissions";
import { RejectedSubmissions } from "./submissions/RejectedSubmissions";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export const SubmissionsList = () => {
  console.log('🔄 SubmissionsList component rendering');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { 
    pendingSubmissions, 
    approvedSubmissions, 
    rejectedSubmissions,
    isLoading,
    error 
  } = useSubmissions();

  const filterSubmissionsByUsername = (submissions: any[]) => {
    if (!searchQuery) return submissions;
    return submissions.filter(submission => 
      submission.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  if (error) {
    console.error('❌ Error loading submissions:', error);
    toast.error("Gönderiler yüklenirken bir hata oluştu");
    return (
      <div className="text-center text-red-600 p-4 bg-red-50 rounded-lg">
        <p>Gönderiler yüklenirken bir hata oluştu.</p>
        <p className="text-sm mt-2">Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.</p>
      </div>
    );
  }

  if (!pendingSubmissions || !approvedSubmissions || !rejectedSubmissions) {
    console.error('❌ Missing submission data');
    return (
      <div className="text-center text-red-600 p-4 bg-red-50 rounded-lg">
        <p>Veri yüklenirken bir hata oluştu.</p>
        <p className="text-sm mt-2">Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.</p>
      </div>
    );
  }

  const hasNoSubmissions = 
    pendingSubmissions.length === 0 && 
    approvedSubmissions.length === 0 && 
    rejectedSubmissions.length === 0;

  if (hasNoSubmissions && !isLoading) {
    return (
      <div className="text-center text-gray-500 p-4">
        Henüz gönderi bulunmuyor.
      </div>
    );
  }

  const filteredPendingSubmissions = filterSubmissionsByUsername(pendingSubmissions);
  const filteredApprovedSubmissions = filterSubmissionsByUsername(approvedSubmissions);
  const filteredRejectedSubmissions = filterSubmissionsByUsername(rejectedSubmissions);

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
        <Input
          type="text"
          placeholder="Kullanıcı adı ile ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 w-full max-w-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <PendingSubmissions 
          submissions={filteredPendingSubmissions} 
          isLoading={isLoading} 
        />
        <ApprovedSubmissions 
          submissions={filteredApprovedSubmissions} 
          isLoading={isLoading} 
        />
        <RejectedSubmissions 
          submissions={filteredRejectedSubmissions} 
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
};

export { SubmissionCard } from "./SubmissionCard";