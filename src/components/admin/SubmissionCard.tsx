import { memo } from "react";
import { Submission } from "./hooks/useSubmissions";
import { ActionButtons } from "./SubmissionActions/ActionButtons";
import { SubmissionStatusBadge } from "./submissions/SubmissionStatusBadge";
import { SubmissionImage } from "./submissions/SubmissionImage";
import { SubmissionInfo } from "./submissions/SubmissionInfo";
import { Hash } from "lucide-react";

interface SubmissionCardProps {
  submission: Submission;
  showSelect?: boolean;
  isSelected?: boolean;
  onSelect?: (id: number) => void;
}

export const SubmissionCard = memo(({ 
  submission, 
  showSelect = false,
  isSelected = false,
  onSelect
}: SubmissionCardProps) => {
  if (!submission) {
    return null;
  }

  const { id, username, status, image_url, created_at, updated_at, comment } = submission;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        <div className="absolute top-3 right-3 z-40 bg-black/50 text-white px-2 py-1 rounded-md flex items-center gap-1">
          <Hash className="h-4 w-4" />
          <span className="text-sm font-medium">{id}</span>
        </div>
        <SubmissionImage 
          imageUrl={image_url} 
          username={username} 
        />
      </div>
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