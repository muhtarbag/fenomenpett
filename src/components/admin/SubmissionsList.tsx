import { useSubmissions } from "./hooks/useSubmissions";
import { PendingSubmissions } from "./submissions/PendingSubmissions";
import { ApprovedSubmissions } from "./submissions/ApprovedSubmissions";
import { RejectedSubmissions } from "./submissions/RejectedSubmissions";
import { toast } from "sonner";

export const SubmissionsList = () => {
  console.log('🔄 SubmissionsList component rendering');
  
  const { 
    pendingSubmissions, 
    approvedSubmissions, 
    rejectedSubmissions,
    isLoading,
    error 
  } = useSubmissions();

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <PendingSubmissions 
        submissions={pendingSubmissions} 
        isLoading={isLoading} 
      />
      <ApprovedSubmissions 
        submissions={approvedSubmissions} 
        isLoading={isLoading} 
      />
      <RejectedSubmissions 
        submissions={rejectedSubmissions} 
        isLoading={isLoading} 
      />
    </div>
  );
};

export { SubmissionCard } from "./SubmissionCard";