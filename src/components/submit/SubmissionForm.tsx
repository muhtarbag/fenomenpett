import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { checkForDuplicates } from "./utils/duplicateCheck";
import { calculateImageHash, optimizeImage } from "@/utils/imageProcessing";
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
      console.log('Fotoğraf optimizasyonu başlatılıyor...');

      // Optimize the image
      const optimizedImage = await optimizeImage(image);
      console.log('Fotoğraf optimize edildi:', {
        originalSize: image.size,
        optimizedSize: optimizedImage.size
      });

      // Calculate image hash from optimized image
      const imageHash = await calculateImageHash(optimizedImage);
      console.log('Image hash calculated:', imageHash);

      // Check for duplicates using perceptual hash
      const { isDuplicate, originalSubmission } = await checkForDuplicates(imageHash);
      
      if (isDuplicate && originalSubmission) {
        // Upload image for reference but mark as rejected
        const fileExt = 'webp'; // Always using WebP format
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('submissions')
          .upload(filePath, optimizedImage);

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
            original_submission_id: originalSubmission.id,
            image_hash: imageHash
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
      const fileExt = 'webp'; // Always using WebP format
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('submissions')
        .upload(filePath, optimizedImage);

      if (uploadError) {
        console.error('Storage yükleme hatası:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('submissions')
        .getPublicUrl(filePath);

      // Generate a temporary transaction ID (will be replaced by the trigger)
      const tempTransactionId = `TRX-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const { error: submissionError } = await supabase
        .from('submissions')
        .insert({
          username,
          image_url: publicUrl,
          comment,
          status: 'pending',
          likes: 0,
          image_hash: imageHash,
          transaction_id: tempTransactionId
        });

      if (submissionError) {
        console.error('Gönderi kayıt hatası:', submissionError);
        
        // Check if the error is due to the 30-day cooldown
        if (submissionError.message.includes('30 gün içinde')) {
          toast.error("Aynı kullanıcı adı ile 30 gün içinde tekrar gönderi yapamazsınız.", {
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