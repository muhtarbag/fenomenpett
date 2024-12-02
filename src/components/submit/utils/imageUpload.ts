import { supabase } from "@/integrations/supabase/client";

export const uploadImage = async (image: File, optimizedImage: Blob) => {
  const fileExt = 'webp';
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

  return publicUrl;
};