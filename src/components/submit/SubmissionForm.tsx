import { useState } from "react";
import { toast } from "sonner";
import { validateSubmission, checkExistingSubmission } from "./utils/submissionValidation";
import { handleSubmission } from "./utils/submissionHandler";
import { SubmissionSuccess } from "./SubmissionSuccess";
import { SubmissionFormFields } from "./SubmissionFormFields";

interface SubmissionFormProps {
  onSubmitSuccess?: () => void;
}

export const SubmissionForm = ({ onSubmitSuccess }: SubmissionFormProps) => {
  const [username, setUsername] = useState("");
  const [comment, setComment] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateSubmission(username, image, comment)) {
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('Fotoğraf optimizasyonu başlatılıyor...');

      const hasExistingSubmission = await checkExistingSubmission(username);
      if (hasExistingSubmission) {
        return;
      }

      const success = await handleSubmission({
        username,
        comment,
        image: image as File
      });

      if (success) {
        setIsSuccess(true);
        onSubmitSuccess?.();
      }
    } catch (error: any) {
      console.error('Gönderi hatası:', error);
      toast.error("Gönderiniz kaydedilirken bir hata oluştu: " + (error.message || "Bilinmeyen hata"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return <SubmissionSuccess />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md animate-fade-up">
      <SubmissionFormFields
        username={username}
        setUsername={setUsername}
        comment={comment}
        setComment={setComment}
        image={image}
        setImage={setImage}
        isSubmitting={isSubmitting}
      />
    </form>
  );
};