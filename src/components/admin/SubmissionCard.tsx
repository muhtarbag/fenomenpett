import { Check, X, Trash2 } from "lucide-react";
import { Submission } from "./hooks/useSubmissions";
import { useSubmissionMutation } from "./hooks/useSubmissionMutation";
import { useDeleteSubmissionMutation } from "./hooks/useDeleteSubmissionMutation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SubmissionCardProps {
  submission: Submission;
}

export const SubmissionCard = ({ submission }: SubmissionCardProps) => {
  console.log('🎴 Rendering SubmissionCard:', {
    id: submission.id,
    username: submission.username,
    currentStatus: submission.status
  });

  const { mutate: updateStatus, isLoading: isUpdating } = useSubmissionMutation();
  const { mutate: deleteSubmission, isLoading: isDeleting } = useDeleteSubmissionMutation();

  const handleApprove = async (id: number) => {
    console.log('👍 Approving submission:', id);
    updateStatus(
      { id, status: 'approved' },
      {
        onSuccess: () => {
          console.log('✅ Successfully approved submission:', id);
        },
        onError: (error) => {
          console.error('❌ Error approving submission:', error);
        }
      }
    );
  };

  const handleReject = async (id: number) => {
    console.log('👎 Rejecting submission:', id);
    updateStatus(
      { id, status: 'rejected' },
      {
        onSuccess: () => {
          console.log('✅ Successfully rejected submission:', id);
        },
        onError: (error) => {
          console.error('❌ Error rejecting submission:', error);
        }
      }
    );
  };

  const handleDelete = async (id: number) => {
    console.log('🗑️ Deleting submission:', id);
    deleteSubmission(id, {
      onSuccess: () => {
        console.log('✅ Successfully deleted submission:', id);
      },
      onError: (error) => {
        console.error('❌ Error deleting submission:', error);
      }
    });
  };

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
            <button
              onClick={() => handleApprove(submission.id)}
              disabled={isUpdating}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-success text-white rounded-md hover:bg-success/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check size={20} />
              {isUpdating ? 'İşleniyor...' : 'Onayla'}
            </button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  disabled={isUpdating}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-danger text-white rounded-md hover:bg-danger/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X size={20} />
                  {isUpdating ? 'İşleniyor...' : 'Reddet'}
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Gönderiyi Reddet</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bu gönderiyi reddetmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>İptal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleReject(submission.id)}
                    className="bg-danger hover:bg-danger/90"
                  >
                    Reddet
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
        {submission.status === 'approved' && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                disabled={isDeleting}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-danger text-white rounded-md hover:bg-danger/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 size={20} />
                {isDeleting ? 'Siliniyor...' : 'Gönderiyi Sil'}
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Gönderiyi Sil</AlertDialogTitle>
                <AlertDialogDescription>
                  Bu gönderiyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>İptal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDelete(submission.id)}
                  className="bg-danger hover:bg-danger/90"
                >
                  Sil
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        {submission.status === 'rejected' && (
          <div className="flex gap-4">
            <button
              onClick={() => handleApprove(submission.id)}
              disabled={isUpdating}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-success text-white rounded-md hover:bg-success/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check size={20} />
              {isUpdating ? 'İşleniyor...' : 'Onayla'}
            </button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  disabled={isDeleting}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-danger text-white rounded-md hover:bg-danger/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 size={20} />
                  {isDeleting ? 'Siliniyor...' : 'Sil'}
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Gönderiyi Sil</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bu gönderiyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>İptal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(submission.id)}
                    className="bg-danger hover:bg-danger/90"
                  >
                    Sil
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </div>
  );
};