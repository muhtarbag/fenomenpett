import { supabase } from "@/integrations/supabase/client";

interface DuplicateCheckResult {
  isDuplicate: boolean;
  originalSubmission: {
    id: number;
    username: string;
  } | null;
}

export const checkForDuplicates = async (imageUrl: string): Promise<DuplicateCheckResult> => {
  console.log('Checking for duplicates:', imageUrl);
  
  const { data: existingSubmissions, error } = await supabase
    .from('submissions')
    .select('id, image_url, username')
    .or(`status.eq.approved,status.eq.pending`);

  if (error) {
    console.error('Error checking for duplicates:', error);
    return { isDuplicate: false, originalSubmission: null };
  }

  const duplicateSubmission = existingSubmissions?.find(submission => 
    submission.image_url === imageUrl
  );

  return {
    isDuplicate: !!duplicateSubmission,
    originalSubmission: duplicateSubmission ? {
      id: duplicateSubmission.id,
      username: duplicateSubmission.username
    } : null
  };
};