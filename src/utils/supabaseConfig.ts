
import { supabase } from '@/integrations/supabase/client';

// Function to create necessary buckets if they don't exist
export const ensureStorageBucket = async () => {
  try {
    // Check if the bucket exists
    const { error: checkError } = await supabase.storage.getBucket('file_storage');
    
    // If bucket doesn't exist, create it
    if (checkError) {
      console.log('Storage bucket "file_storage" does not exist. Attempting to create it...');
      const { error: createError } = await supabase.storage.createBucket('file_storage', {
        public: false,
        fileSizeLimit: 52428800, // 50MB
      });
      
      if (createError) {
        console.error('Error creating storage bucket:', createError);
        return false;
      }
      console.log('Storage bucket "file_storage" created successfully');
      return true;
    }
    
    console.log('Storage bucket "file_storage" exists');
    return true;
  } catch (error) {
    console.error('Error checking/creating storage bucket:', error);
    return false;
  }
};
