import { useSubmissions } from "./hooks/useSubmissions";
import { SubmissionCard } from "./SubmissionCard";

export const SubmissionsList = () => {
  console.log('🔄 SubmissionsList component rendering');
  const { 
    pendingSubmissions, 
    approvedSubmissions, 
    rejectedSubmissions,
    isLoading 
  } = useSubmissions();

  if (isLoading) {
    console.log('⏳ Loading submissions...');
    return <div className="text-center">Yükleniyor...</div>;
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