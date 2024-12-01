import { memo } from "react";
import { Submission } from "./hooks/useSubmissions";
import { ActionButtons } from "./SubmissionActions/ActionButtons";
import { SubmissionStatusBadge } from "./submissions/SubmissionStatusBadge";
import { SubmissionImage } from "./submissions/SubmissionImage";
import { SubmissionInfo } from "./submissions/SubmissionInfo";
import { Checkbox } from "@/components/ui/checkbox";
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
      <div className="relative">
        {showSelect && (
          <div className="absolute top-2 left-2 z-10">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onSelect?.(id)}
              className="bg-white/90 border-2 w-5 h-5 rounded-sm shadow-sm hover:bg-white/100 transition-colors"
            />
          </div>
        )}
        <div className="absolute top-2 right-2 z-10 bg-black/50 text-white px-2 py-1 rounded-md flex items-center gap-1">
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