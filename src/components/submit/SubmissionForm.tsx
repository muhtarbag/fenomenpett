import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { checkForDuplicates } from "./utils/duplicateCheck";
import { calculateImageHash } from "@/utils/imageProcessing";
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
      console.log('Gönderim işlemi başlatılıyor...');

      // Calculate image hash
      const imageHash = await calculateImageHash(image);
      console.log('Image hash calculated:', imageHash);

      // Check for duplicates using perceptual hash
      const { isDuplicate, originalSubmission } = await checkForDuplicates(imageHash);
      
      if (isDuplicate && originalSubmission) {
        // Upload image for reference but mark as rejected
        const fileExt = image.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('submissions')
          .upload(filePath, image);

        if (uploadError) {
          console.error('Storage yükleme hatası:', uploadError);
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('submissions')
          .getPublicUrl(filePath);

        const { error: rejectionError } = await supabase
          .from('rejected_submissions')
          .insert([{
            username,
            image_url: publicUrl,
            comment,
            reason: `Duplicate image detected (Hamming distance within threshold). Original submission by user: ${originalSubmission.username}`,
            original_submission_id: originalSubmission.id
          }]);

        if (rejectionError) {
          console.error('Rejection kayıt hatası:', rejectionError);
          throw rejectionError;
        }

        toast.error("Bu fotoğrafa çok benzer bir fotoğraf daha önce başka bir kullanıcı tarafından yüklenmiş. Lütfen farklı bir fotoğraf deneyin.", {
          style: {
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: '#FF0000',
            backgroundColor: '#FFF',
            border: '2px solid #FF0000'
          },
        });
        return;
      }

      // If not a duplicate, proceed with submission
      const fileExt = image.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('submissions')
        .upload(filePath, image);

      if (uploadError) {
        console.error('Storage yükleme hatası:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('submissions')
        .getPublicUrl(filePath);

      const { error: submissionError } = await supabase
        .from('submissions')
        .insert([{
          username,
          image_url: publicUrl,
          comment,
          status: 'pending',
          likes: 0,
          image_hash: imageHash
        }]);

      if (submissionError) {
        console.error('Gönderi kayıt hatası:', submissionError);
        throw submissionError;
      }

      console.log('Gönderi başarıyla kaydedildi');
      toast.success("Gönderiniz başarıyla kaydedildi! Moderatör onayından sonra yayınlanacaktır.");
      setIsSuccess(true);
      onSubmitSuccess?.();
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