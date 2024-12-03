import { useState } from "react";
import { toast } from "sonner";
import { validateSubmission } from "./utils/submissionValidation";
import { handleSubmission } from "./utils/submissionHandler";
import { SubmissionSuccess } from "./SubmissionSuccess";
import { SubmissionFormFields } from "./SubmissionFormFields";
import { supabase } from "@/integrations/supabase/client";

interface SubmissionFormProps {
  onSubmitSuccess?: () => void;
}

export const SubmissionForm = ({ onSubmitSuccess }: SubmissionFormProps) => {
  const [username, setUsername] = useState("");
  const [comment, setComment] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const checkCooldown = async (username: string) => {
    const { data, error } = await supabase
      .rpc('check_submission_cooldown', {
        p_username: username
      });

    if (error) {
      console.error('Cooldown check error:', error);
      return null;
    }

    return data?.[0] || null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      toast.error("Lütfen kullanıcı adınızı girin");
      return;
    }

    if (!image) {
      toast.error("Lütfen bir fotoğraf yükleyin");
      return;
    }

    if (!comment.trim()) {
      toast.error("Lütfen bir yorum yazın");
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('Fotoğraf optimizasyonu başlatılıyor...');

      // Check cooldown before proceeding
      const cooldownInfo = await checkCooldown(username);
      if (cooldownInfo?.has_cooldown) {
        const lastSubmissionDate = new Date(cooldownInfo.last_submission_date)
          .toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          });

        const nextSubmissionDate = new Date(cooldownInfo.next_submission_date)
          .toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          });

        toast.error(
          <div className="space-y-2">
            <p className="font-semibold">Gönderim süresi kısıtlaması</p>
            <p>Son gönderiniz: {lastSubmissionDate}</p>
            <p>Yeni gönderim yapabileceğiniz tarih: {nextSubmissionDate}</p>
            <p>Kalan süre: {cooldownInfo.days_remaining} gün</p>
          </div>,
          {
            duration: 6000
          }
        );
        return;
      }

      const validationResult = await validateSubmission(username);
      if (!validationResult.isValid) {
        toast.error(validationResult.message);
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