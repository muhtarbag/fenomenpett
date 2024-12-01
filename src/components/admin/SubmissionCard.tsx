import { memo } from "react";
import { Submission } from "./hooks/useSubmissions";
import { ActionButtons } from "./SubmissionActions/ActionButtons";
import { SubmissionStatusBadge } from "./submissions/SubmissionStatusBadge";
import { SubmissionImage } from "./submissions/SubmissionImage";
import { SubmissionInfo } from "./submissions/SubmissionInfo";

interface SubmissionCardProps {
  submission: Submission;
}

export const SubmissionCard = memo(({ submission }: SubmissionCardProps) => {
  if (!submission) {
    console.error('No submission data provided');
    return null;
  }

  const { id, username, status, image_url, created_at, updated_at, comment } = submission;

  console.log('🎴 Rendering SubmissionCard:', {
    id,
    username,
    currentStatus: status,
    timestamp: new Date().toISOString()
  });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-fade-up">
      <SubmissionImage 
        imageUrl={image_url} 
        username={username} 
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <SubmissionInfo 
            username={username}
            createdAt={created_at}
            updatedAt={updated_at}
          />
          {status && status !== 'pending' && (
            <SubmissionStatusBadge status={status} />
          )}
        </div>
        <p className="text-gray-600 mb-4">{comment || 'Yorum yok'}</p>
        <ActionButtons submission={submission} />
      </div>
    </div>
  );
});

SubmissionCard.displayName = 'SubmissionCard';