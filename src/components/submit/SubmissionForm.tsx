import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { checkForDuplicates } from "./utils/duplicateCheck";
import { SubmissionSuccess } from "./SubmissionSuccess";
import { SubmissionFormFields } from "./SubmissionFormFields";

export const SubmissionForm = () => {
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

      const fileExt = image.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      console.log('Fotoğraf yükleniyor...', { fileName, filePath });
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

      console.log('Fotoğraf başarıyla yüklendi, public URL:', publicUrl);

      const { isDuplicate, originalSubmission } = await checkForDuplicates(publicUrl);
      
      if (isDuplicate && originalSubmission) {
        const { error: rejectionError } = await supabase
          .from('rejected_submissions')
          .insert([{
            username,
            image_url: publicUrl,
            comment,
            reason: `Duplicate image submission. Original submission by user: ${originalSubmission.username}`,
            original_submission_id: originalSubmission.id
          }]);

        if (rejectionError) {
          console.error('Rejection kayıt hatası:', rejectionError);
          throw rejectionError;
        }

        await supabase.storage
          .from('submissions')
          .remove([filePath]);

        toast.error("Bu fotoğraf daha önce başka bir kullanıcı tarafından yüklenmiş. Lütfen farklı bir fotoğraf deneyin.");
        return;
      }

      const { error: submissionError } = await supabase
        .from('submissions')
        .insert([{
          username,
          image_url: publicUrl,
          comment,
          status: 'pending',
          likes: 0
        }]);

      if (submissionError) {
        console.error('Gönderi kayıt hatası:', submissionError);
        throw submissionError;
      }

      console.log('Gönderi başarıyla kaydedildi');
      toast.success("Gönderiniz başarıyla kaydedildi! Moderatör onayından sonra yayınlanacaktır.");
      setIsSuccess(true);
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