
import { supabase } from '@/integrations/supabase/client';

// Function to check if storage bucket exists
export const ensureStorageBucket = async () => {
  try {
    // Check if the bucket exists
    const { error: checkError } = await supabase.storage.getBucket('file_storage');
    
    if (!checkError) {
      console.log('Storage bucket "file_storage" exists');
      return true;
    } else {
      // We can't create buckets with the anon key due to RLS policies
      // Just log this information for debugging purposes
      console.log('Storage bucket "file_storage" does not exist or not accessible with current permissions');
      
      // Return false to indicate that bucket operations may not work
      return false;
    }
  } catch (error) {
    console.error('Error checking storage bucket:', error);
    return false;
  }
};
