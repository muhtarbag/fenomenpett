import { supabase } from "@/integrations/supabase/client";

export const checkSubmissionCooldown = async (username: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .rpc('check_submission_cooldown', {
        p_username: username
      });

    if (error) {
      console.error('Error checking submission cooldown:', error);
      throw error;
    }

    return data?.[0]?.has_cooldown || false;
  } catch (error) {
    console.error('Error in checkSubmissionCooldown:', error);
    throw error;
  }
};

export const validateSubmission = async (username: string): Promise<{ isValid: boolean; message?: string }> => {
  try {
    const hasCooldown = await checkSubmissionCooldown(username);

    if (hasCooldown) {
      return {
        isValid: false,
        message: "Aynı kullanıcı adı ile 30 gün içinde tekrar gönderi yapamazsınız."
      };
    }

    return { isValid: true };
  } catch (error) {
    console.error('Validation error:', error);
    return {
      isValid: false,
      message: "Doğrulama sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin."
    };
  }
};