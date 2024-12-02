import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { uploadImage } from "./imageUpload";
import { checkForDuplicates } from "./duplicateCheck";
import { calculateImageHash, optimizeImage } from "@/utils/imageProcessing";

interface SubmissionData {
  username: string;
  comment: string;
  image: File;
}

export const handleSubmission = async (data: SubmissionData) => {
  const { username, comment, image } = data;

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
    const publicUrl = await uploadImage(image, optimizedImage);

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
    return false;
  }

  // If not a duplicate, proceed with submission
  const publicUrl = await uploadImage(image, optimizedImage);

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
    throw submissionError;
  }

  console.log('Gönderi başarıyla kaydedildi');
  toast.success("Gönderiniz başarıyla kaydedildi! Moderatör onayından sonra yayınlanacaktır.");
  return true;
};