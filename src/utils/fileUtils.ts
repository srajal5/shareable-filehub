
import { supabase, checkBucketExists } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

// Bucket name
export const STORAGE_BUCKET = 'File Storage';

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

// Generate a data URL from a file (for local fallback)
export const fileToDataURL = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Generate a blob URL from a file (for local download)
export const generateLocalDownloadURL = (file: File): Promise<string> => {
  return fileToDataURL(file);
};

// Generate a sharing URL using Supabase storage URL or local URL
export const generateShareableLink = async (filePath: string, localUrl?: string): Promise<string> => {
  // Check if bucket exists first
  const bucketExists = await checkBucketExists(STORAGE_BUCKET);
  
  if (bucketExists) {
    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);
    return data.publicUrl;
  } else if (localUrl) {
    return localUrl;
  } else {
    // If no local URL is provided and bucket doesn't exist, return a placeholder
    return '/file-not-available';
  }
};

// Save a file to Supabase storage or fallback to local storage
export const saveFile = async (
  file: File, 
  userId: string,
  onProgress?: (progress: number) => void
): Promise<StoredFile> => {
  const fileId = generateUniqueId();
  const fileExt = file.name.split('.').pop();
  const filePath = `${userId}/${fileId}.${fileExt}`;
  
  // Create a local URL for the file as fallback
  const localUrl = await fileToDataURL(file);
  
  let url = localUrl;
  let uploadSuccessful = false;
  
  // Check if bucket exists
  const bucketExists = await checkBucketExists(STORAGE_BUCKET);
  
  if (bucketExists) {
    try {
      // Create blob for upload and track progress
      const fileBlob = file.slice(0, file.size, file.type);
      
      // Track progress simulation
      let uploadInterval: number | undefined;
      if (onProgress) {
        let progress = 0;
        uploadInterval = window.setInterval(() => {
          progress += 5;
          if (progress > 95) {
            // Stop at 95% until actual upload confirms completion
            clearInterval(uploadInterval);
            onProgress(95);
          } else {
            onProgress(progress);
          }
        }, 100);
      }
      
      // Create and track upload
      const { error, data } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, fileBlob, {
          cacheControl: '3600',
          upsert: false,
        });
      
      // Clear the interval if it was set
      if (uploadInterval) {
        clearInterval(uploadInterval);
      }
      
      if (error) {
        console.error("Upload error:", error);
        // Set progress to 100% even on error to prevent UI being stuck
        if (onProgress) {
          onProgress(100);
        }
        throw error;
      }
      
      // Set final progress to 100%
      if (onProgress) {
        onProgress(100);
      }
      
      // Get the public URL for the uploaded file
      const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);
      url = urlData.publicUrl;
      uploadSuccessful = true;
    } catch (error) {
      console.error('Error uploading file to Supabase storage:', error);
      // We'll fall back to local URL
    }
  } else {
    console.log("Using local storage fallback for files");
    // Simulate progress for consistent experience
    if (onProgress) {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        onProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 100);
    }
  }
  
  // Store file metadata in localStorage for this example
  const storedFile: StoredFile = {
    id: fileId,
    name: file.name,
    size: file.size,
    type: file.type,
    uploadDate: new Date(),
    url: url,
    userId,
    path: uploadSuccessful ? filePath : undefined,
    localUrl: !uploadSuccessful ? localUrl : undefined
  };
  
  // Store file metadata in localStorage
  const files = getStoredFiles(userId);
  files.push(storedFile);
  localStorage.setItem(`files_${userId}`, JSON.stringify(files));
  
  return storedFile;
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
  localUrl?: string; // Local fallback URL
}

// Get stored files from localStorage
export const getStoredFiles = (userId: string): StoredFile[] => {
  const filesJson = localStorage.getItem(`files_${userId}`);
  return filesJson ? JSON.parse(filesJson) : [];
};

// Delete a file from Supabase storage or local storage
export const deleteFile = async (fileId: string, userId: string): Promise<void> => {
  const files = getStoredFiles(userId);
  const fileToDelete = files.find(file => file.id === fileId);
  
  if (fileToDelete?.path) {
    // Try to delete from Supabase storage if path exists
    try {
      const { error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .remove([fileToDelete.path]);
      
      if (error) {
        console.error("Error deleting from Supabase:", error);
      }
    } catch (err) {
      console.error("Failed to delete from Supabase storage:", err);
    }
  }
  
  // Update localStorage regardless of Supabase success
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

// Download a file - handles both Supabase and local URLs
export const downloadFile = async (fileId: string): Promise<void> => {
  const file = getFileById(fileId);
  
  if (!file) {
    console.error('File not found');
    return;
  }
  
  try {
    let downloadUrl = file.url;
    
    if (file.localUrl) {
      // If we have a local URL (data URL), use that directly
      downloadUrl = file.localUrl;
    } else if (file.path) {
      // For Supabase paths, check if bucket exists first
      const bucketExists = await checkBucketExists(STORAGE_BUCKET);
      
      if (!bucketExists) {
        console.error('Storage bucket not accessible for download');
        throw new Error('Storage bucket not accessible');
      }
    }
    
    // Create a temporary link and trigger the download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return;
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
};
