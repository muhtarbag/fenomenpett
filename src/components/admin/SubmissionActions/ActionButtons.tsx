import { Submission } from "../hooks/useSubmissions";
import { useSubmissionMutation } from "../hooks/useSubmissionMutation";
import { useDeleteSubmissionMutation } from "../hooks/useDeleteSubmissionMutation";
import { ApproveButton } from "./ApproveButton";
import { RejectButton } from "./RejectButton";
import { DeleteButton } from "./DeleteButton";

interface ActionButtonsProps {
  submission: Submission;
}

export const ActionButtons = ({ submission }: ActionButtonsProps) => {
  const updateMutation = useSubmissionMutation();
  const deleteMutation = useDeleteSubmissionMutation();

  if (submission.status === 'pending') {
    return (
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
    );
  }

  if (submission.status === 'approved') {
    return (
      <DeleteButton 
        submissionId={submission.id} 
        mutation={deleteMutation}
        className="w-full" 
      />
    );
  }

  if (submission.status === 'rejected') {
    return (
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
    );
  }

  return null;
};