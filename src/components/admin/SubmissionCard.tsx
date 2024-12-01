import { Submission } from "./hooks/useSubmissions";
import { useSubmissionMutation } from "./hooks/useSubmissionMutation";
import { useDeleteSubmissionMutation } from "./hooks/useDeleteSubmissionMutation";
import { ApproveButton } from "./SubmissionActions/ApproveButton";
import { RejectButton } from "./SubmissionActions/RejectButton";
import { DeleteButton } from "./SubmissionActions/DeleteButton";

interface SubmissionCardProps {
  submission: Submission;
}

export const SubmissionCard = ({ submission }: SubmissionCardProps) => {
  console.log('🎴 Rendering SubmissionCard:', {
    id: submission.id,
    username: submission.username,
    currentStatus: submission.status
  });

  const updateMutation = useSubmissionMutation();
  const deleteMutation = useDeleteSubmissionMutation();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('tr-TR');
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-fade-up">
      <img
        src={submission.image_url}
        alt={`${submission.username} tarafından gönderildi`}
        className="w-full h-64 object-cover"
        onError={(e) => {
          console.error('❌ Image load error:', submission.image_url);
          e.currentTarget.src = '/placeholder.svg';
        }}
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="font-semibold text-gray-900">
              @{submission.username}
            </p>
            <p className="text-sm text-gray-500">
              Gönderim: {formatDate(submission.created_at)}
            </p>
            {submission.updated_at !== submission.created_at && (
              <p className="text-sm text-gray-500">
                İşlem: {formatDate(submission.updated_at)}
              </p>
            )}
          </div>
          {submission.status !== 'pending' && (
            <span className={`px-3 py-1 rounded-full text-sm ${
              submission.status === 'approved' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {submission.status === 'approved' ? 'Onaylandı' : 'Reddedildi'}
            </span>
          )}
        </div>
        <p className="text-gray-600 mb-4">{submission.comment}</p>
        
        {submission.status === 'pending' && (
          <div className="flex gap-4">
            <ApproveButton 
              submissionId={submission.id} 
              mutation={updateMutation} 
            />
            <RejectButton 
              submissionId={submission.id} 
              mutation={updateMutation} 
            />
          </div>
        )}

        {submission.status === 'approved' && (
          <DeleteButton 
            submissionId={submission.id} 
            mutation={deleteMutation}
            className="w-full" 
          />
        )}

        {submission.status === 'rejected' && (
          <div className="flex gap-4">
            <ApproveButton 
              submissionId={submission.id} 
              mutation={updateMutation} 
            />
            <DeleteButton 
              submissionId={submission.id} 
              mutation={deleteMutation} 
            />
          </div>
        )}
      </div>
    </div>
  );
};