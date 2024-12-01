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
        Gönderiler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.
      </div>
    );
  }

  const hasNoSubmissions = 
    (!pendingSubmissions?.length || pendingSubmissions.length === 0) && 
    (!approvedSubmissions?.length || approvedSubmissions.length === 0) && 
    (!rejectedSubmissions?.length || rejectedSubmissions.length === 0);

  if (hasNoSubmissions && !isLoading) {
    return (
      <div className="text-center text-gray-500 p-4">
        Henüz gönderi bulunmuyor.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PendingSubmissions 
        submissions={pendingSubmissions || []} 
        isLoading={isLoading} 
      />
      <ApprovedSubmissions 
        submissions={approvedSubmissions || []} 
        isLoading={isLoading} 
      />
      <RejectedSubmissions 
        submissions={rejectedSubmissions || []} 
        isLoading={isLoading} 
      />
    </div>
  );
};