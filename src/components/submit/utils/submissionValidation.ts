import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const calculateRemainingDays = (lastSubmissionDate: string): number => {
  const lastSubmission = new Date(lastSubmissionDate);
  const thirtyDaysFromSubmission = new Date(lastSubmission.getTime() + (30 * 24 * 60 * 60 * 1000));
  const now = new Date();
  const remainingTime = thirtyDaysFromSubmission.getTime() - now.getTime();
  return Math.ceil(remainingTime / (1000 * 60 * 60 * 24));
};

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
    const remainingDays = calculateRemainingDays(existingSubmission.created_at);
    if (remainingDays > 0) {
      toast.error(`Bu kullanıcı adı ile yeni bir gönderi yapabilmeniz için ${remainingDays} gün beklemeniz gerekiyor.`, {
        style: {
          fontSize: '1.2rem',
          fontWeight: 'bold',
          color: '#FF0000',
          backgroundColor: '#FFF',
          border: '2px solid #FF0000'
        },
      });
      return true;
    }
  }

  return false;
};