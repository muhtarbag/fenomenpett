import { useSubmissions } from "./hooks/useSubmissions";
import { SubmissionCard } from "./SubmissionCard";

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
    return (
      <div className="text-center text-red-600">
        Gönderiler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.
      </div>
    );
  }

  if (isLoading) {
    console.log('⏳ Loading submissions...');
    return <div className="text-center">Yükleniyor...</div>;
  }

  if (!pendingSubmissions || !approvedSubmissions || !rejectedSubmissions) {
    console.error('❌ Missing submission data');
    return (
      <div className="text-center text-red-600">
        Veri yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.
      </div>
    );
  }

  const hasNoSubmissions = 
    pendingSubmissions.length === 0 && 
    approvedSubmissions.length === 0 && 
    rejectedSubmissions.length === 0;

  if (hasNoSubmissions) {
    return (
      <div className="text-center text-gray-500">
        Henüz gönderi bulunmuyor.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {pendingSubmissions?.map((submission) => (
        <SubmissionCard key={submission.id} submission={submission} />
      ))}
      {approvedSubmissions?.map((submission) => (
        <SubmissionCard key={submission.id} submission={submission} />
      ))}
      {rejectedSubmissions?.map((submission) => (
        <SubmissionCard key={submission.id} submission={submission} />
      ))}
    </div>
  );
};

export { SubmissionCard };