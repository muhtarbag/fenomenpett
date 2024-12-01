import { supabase } from "@/integrations/supabase/client";
import { calculateHammingDistance } from "@/utils/imageProcessing";

interface DuplicateCheckResult {
  isDuplicate: boolean;
  originalSubmission: {
    id: number;
    username: string;
    imageHash?: string;
  } | null;
}

export const checkForDuplicates = async (imageHash: string): Promise<DuplicateCheckResult> => {
  console.log('Checking for duplicates with hash:', imageHash);
  
  const { data: existingSubmissions, error } = await supabase
    .from('submissions')
    .select('id, username, image_hash')
    .or('status.eq.approved,status.eq.pending');

  if (error) {
    console.error('Error checking for duplicates:', error);
    return { isDuplicate: false, originalSubmission: null };
  }

  if (!existingSubmissions) {
    return { isDuplicate: false, originalSubmission: null };
  }

  // Increased threshold to be more lenient (was 5 before)
  const SIMILARITY_THRESHOLD = 15; 
  
  const duplicate = existingSubmissions.find(submission => {
    if (!submission.image_hash) return false;
    const distance = calculateHammingDistance(imageHash, submission.image_hash);
    console.log('Hamming distance for submission', submission.id, ':', distance);
    return distance <= SIMILARITY_THRESHOLD;
  });

  return {
    isDuplicate: !!duplicate,
    originalSubmission: duplicate ? {
      id: duplicate.id,
      username: duplicate.username,
      imageHash: duplicate.image_hash
    } : null
  };
};