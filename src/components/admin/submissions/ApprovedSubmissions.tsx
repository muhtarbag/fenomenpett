import { Submission } from "../hooks/useSubmissions";
import { SubmissionCard } from "../SubmissionCard";

interface ApprovedSubmissionsProps {
  submissions: Submission[];
  isLoading: boolean;
}

export const ApprovedSubmissions = ({ submissions, isLoading }: ApprovedSubmissionsProps) => {
  if (isLoading) {
    return <div className="text-center">Yükleniyor...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {submissions.map((submission) => (
        <SubmissionCard key={submission.id} submission={submission} />
      ))}
      {submissions.length === 0 && (
        <div className="col-span-full text-center text-gray-500">
          Onaylanmış gönderi bulunmuyor
        </div>
      )}
    </div>
  );
};