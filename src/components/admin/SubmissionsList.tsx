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

  return {
    pendingSubmissions,
    approvedSubmissions,
    rejectedSubmissions,
    isLoading,
    SubmissionCard
  };
};

export { SubmissionCard };