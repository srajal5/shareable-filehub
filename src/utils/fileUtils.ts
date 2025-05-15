
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

// Generate a unique ID for files
export const generateUniqueId = (): string => {
  return uuidv4();
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Get file type icon based on MIME type or extension
export const getFileTypeIcon = (file: File): string => {
  const fileType = file.type.split('/')[0];
  
  switch (fileType) {
    case 'image':
      return 'image';
    case 'video':
      return 'video';
    case 'audio':
      return 'audio';
    case 'application':
      if (file.name.endsWith('.pdf')) return 'file-text';
      if (file.name.endsWith('.zip') || file.name.endsWith('.rar')) return 'file-archive';
      return 'file';
    case 'text':
      return 'file-text';
    default:
      return 'file';
  }
};

// Generate a sharing URL using Supabase storage URL
export const generateShareableLink = (filePath: string): string => {
  const { data } = supabase.storage.from('file_storage').getPublicUrl(filePath);
  return data.publicUrl;
};

// Helper function to create storage bucket if it doesn't exist
export const ensureStorageBucket = async (): Promise<boolean> => {
  try {
    // Check if bucket exists by trying to get its details
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(b => b.name === 'file_storage');
    
    if (!bucketExists) {
      console.log('Storage bucket does not exist, creating...');
      // Bucket doesn't exist yet, create it
      const { error } = await supabase.storage.createBucket('file_storage', {
        public: true,
        fileSizeLimit: 50000000, // 50MB limit
      });
      
      if (error) {
        console.error('Error creating storage bucket:', error);
        return false;
      }
      console.log('Storage bucket created successfully');
    }
    
    return true;
  } catch (error) {
    console.error('Error checking/creating bucket:', error);
    return false;
  }
};

// Save a file to Supabase storage with progress tracking
export const saveFile = async (
  file: File, 
  userId: string,
  onProgress?: (progress: number) => void
): Promise<StoredFile> => {
  // Ensure storage bucket exists
  const bucketReady = await ensureStorageBucket();
  if (!bucketReady) {
    throw new Error('Could not create or access storage bucket');
  }
  
  const fileId = generateUniqueId();
  const fileExt = file.name.split('.').pop();
  const filePath = `${userId}/${fileId}.${fileExt}`;
  
  try {
    // Start progress reporting
    if (onProgress) {
      onProgress(0);
    }
    
    console.log(`Uploading file: ${file.name} (${file.size} bytes)`);
    
    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from('file_storage')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }
    
    console.log('File uploaded successfully');
    
    // Get the public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from('file_storage')
      .getPublicUrl(filePath);
    
    if (!urlData || !urlData.publicUrl) {
      throw new Error('Failed to get public URL for uploaded file');
    }
    
    // Complete progress reporting
    if (onProgress) {
      onProgress(100);
    }
    
    // Store file metadata in localStorage for this example
    // In a real app, you might want to store this in a database table
    const storedFile: StoredFile = {
      id: fileId,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadDate: new Date(),
      url: urlData.publicUrl,
      userId,
      path: filePath
    };
    
    // Store file metadata in localStorage (for compatibility with existing code)
    const files = getStoredFiles(userId);
    files.push(storedFile);
    localStorage.setItem(`files_${userId}`, JSON.stringify(files));
    
    return storedFile;
  } catch (error) {
    console.error('Error in saveFile:', error);
    // Ensure we reset the progress in case of error
    if (onProgress) {
      onProgress(0);
    }
    throw error;
  }
};

// Interface for stored file metadata
export interface StoredFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
  url: string;
  userId: string;
  path?: string; // Supabase storage path
}

// Get stored files from localStorage
export const getStoredFiles = (userId: string): StoredFile[] => {
  const filesJson = localStorage.getItem(`files_${userId}`);
  return filesJson ? JSON.parse(filesJson) : [];
};

// Delete a file from Supabase storage
export const deleteFile = async (fileId: string, userId: string): Promise<void> => {
  const files = getStoredFiles(userId);
  const fileToDelete = files.find(file => file.id === fileId);
  
  if (fileToDelete?.path) {
    // Delete from Supabase storage
    const { error } = await supabase.storage
      .from('file_storage')
      .remove([fileToDelete.path]);
    
    if (error) {
      throw error;
    }
  }
  
  // Update localStorage
  const updatedFiles = files.filter(file => file.id !== fileId);
  localStorage.setItem(`files_${userId}`, JSON.stringify(updatedFiles));
};

// Get a file by ID
export const getFileById = (fileId: string): StoredFile | null => {
  // In a real app, this would query the database
  // For our mock, we need to check all users' files
  const allUserIds = Object.keys(localStorage)
    .filter(key => key.startsWith('files_'))
    .map(key => key.replace('files_', ''));
  
  for (const userId of allUserIds) {
    const files = getStoredFiles(userId);
    const file = files.find(f => f.id === fileId);
    if (file) return file;
  }
  
  return null;
};
