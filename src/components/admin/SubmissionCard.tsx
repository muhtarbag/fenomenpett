import { Submission } from "./hooks/useSubmissions";
import { ActionButtons } from "./SubmissionActions/ActionButtons";
import { SubmissionStatusBadge } from "./submissions/SubmissionStatusBadge";
import { SubmissionImage } from "./submissions/SubmissionImage";
import { SubmissionInfo } from "./submissions/SubmissionInfo";

interface SubmissionCardProps {
  submission: Submission;
}

export const SubmissionCard = ({ submission }: SubmissionCardProps) => {
  console.log('🎴 Rendering SubmissionCard:', {
    id: submission.id,
    username: submission.username,
    currentStatus: submission.status,
    timestamp: new Date().toISOString()
  });

  if (!submission) {
    console.error('No submission data provided');
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-fade-up">
      <SubmissionImage 
        imageUrl={submission.image_url} 
        username={submission.username} 
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <SubmissionInfo 
            username={submission.username}
            createdAt={submission.created_at}
            updatedAt={submission.updated_at}
          />
          {submission.status && submission.status !== 'pending' && (
            <SubmissionStatusBadge status={submission.status} />
          )}
        </div>
        <p className="text-gray-600 mb-4">{submission.comment || 'Yorum yok'}</p>
        <ActionButtons submission={submission} />
      </div>
    </div>
  );
};