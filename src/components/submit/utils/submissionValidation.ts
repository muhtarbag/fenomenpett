import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format, addDays } from "date-fns";

export const validateSubmission = (username: string, image: File | null, comment: string) => {
  if (!username.trim()) {
    toast.error("Lütfen kullanıcı adınızı girin");
    return false;
  }

  if (!image) {
    toast.error("Lütfen bir fotoğraf yükleyin");
    return false;
  }

  if (!comment.trim()) {
    toast.error("Lütfen bir yorum yazın");
    return false;
  }

  return true;
};

export const checkExistingSubmission = async (username: string): Promise<boolean> => {
  const { data: existingSubmission } = await supabase
    .from('submissions')
    .select('created_at')
    .eq('username', username)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (existingSubmission) {
    const submissionDate = new Date(existingSubmission.created_at);
    const nextAllowedDate = addDays(submissionDate, 30);
    const today = new Date();
    const remainingDays = Math.ceil((nextAllowedDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (remainingDays > 0) {
      toast.error(
        `Bu kullanıcı adı ile yeni bir gönderi yapamazsınız.\n\n` +
        `Son gönderiniz: ${format(submissionDate, 'dd.MM.yyyy')}\n` +
        `Yeni gönderi yapabileceğiniz tarih: ${format(nextAllowedDate, 'dd.MM.yyyy')}\n` +
        `Kalan süre: ${remainingDays} gün`,
        {
          duration: 6000,
          style: {
            background: '#fee2e2',
            border: '1px solid #ef4444',
            whiteSpace: 'pre-line'
          }
        }
      );
      return true;
    }
  }

  return false;
};