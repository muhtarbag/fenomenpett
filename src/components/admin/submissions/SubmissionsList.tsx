import { SubmissionCard } from "../SubmissionCard";
import { Submission } from "../hooks/useSubmissions";
import { PaginationControls } from "./PaginationControls";

interface SubmissionsListProps {
  submissions: Submission[];
  isLoading: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
}

export const SubmissionsList = ({
  submissions,
  isLoading,
  currentPage,
  onPageChange,
  itemsPerPage = 50
}: SubmissionsListProps) => {
  const totalPages = Math.ceil(submissions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSubmissions = submissions.slice(startIndex, endIndex);

  if (isLoading) {
    return <div className="text-center">Yükleniyor...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentSubmissions.map((submission) => (
          <SubmissionCard key={submission.id} submission={submission} />
        ))}
        {currentSubmissions.length === 0 && (
          <div className="col-span-full text-center text-gray-500">
            Gönderi bulunmuyor
          </div>
        )}
      </div>
      
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};