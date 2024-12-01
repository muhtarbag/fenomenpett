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

  // Check for similar images using Hamming distance
  const SIMILARITY_THRESHOLD = 5; // Adjust this value to control sensitivity
  
  const duplicate = existingSubmissions?.find(submission => {
    if (!submission.image_hash) return false;
    const distance = calculateHammingDistance(imageHash, submission.image_hash);
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