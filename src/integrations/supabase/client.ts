
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://mtdpsyzbpenivelqdjex.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10ZHBzeXpicGVuaXZlbHFkamV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4Njg4MjgsImV4cCI6MjA2MDQ0NDgyOH0.rm6bnDr0HuxYqv92ihtsK17ffNjibktKLBU5F0nGADY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Check if the bucket exists
export const checkBucketExists = async (bucketName: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.storage.getBucket(bucketName);
    if (error) {
      console.error(`Storage bucket "${bucketName}" does not exist or not accessible with current permissions`);
      return false;
    }
    return true;
  } catch (error) {
    console.error(`Error checking bucket existence:`, error);
    return false;
  }
};
