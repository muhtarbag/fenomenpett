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
    .or('status.eq.approved,status.eq.pending')
    .not('image_hash', 'is', null);

  if (error) {
    console.error('Error checking for duplicates:', error);
    return { isDuplicate: false, originalSubmission: null };
  }

  if (!existingSubmissions) {
    return { isDuplicate: false, originalSubmission: null };
  }

  // Much higher threshold to reduce false positives
  const SIMILARITY_THRESHOLD = 128; // Increased from 45 to 128 (half of 256 bits)
  
  const duplicate = existingSubmissions.find(submission => {
    if (!submission.image_hash || submission.image_hash.length !== imageHash.length) {
      return false;
    }
    
    const distance = calculateHammingDistance(imageHash, submission.image_hash);
    console.log(`Checking submission ${submission.id} - Hash: ${submission.image_hash} - Distance: ${distance}`);
    
    // Only consider it a duplicate if the hashes are VERY similar
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