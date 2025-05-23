
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

// Generate a sharing URL using Supabase storage URL or fallback to local blob URL
export const generateShareableLink = (filePath: string): string => {
  try {
    const { data } = supabase.storage.from('filestorage').getPublicUrl(filePath);
    return data.publicUrl;
  } catch (error) {
    console.warn('Could not generate shareable link from Supabase, using local URL');
    return filePath; // This could be a blob URL if we're in localStorage fallback mode
  }
};

// Mock upload to localStorage when Supabase storage fails
const mockSaveFileToLocalStorage = (
  file: File,
  userId: string
): StoredFile => {
  const fileId = generateUniqueId();
  
  // Create a mock URL
  const mockUrl = URL.createObjectURL(file);
  
  // Store file metadata in localStorage
  const storedFile: StoredFile = {
    id: fileId,
    name: file.name,
    size: file.size,
    type: file.type,
    uploadDate: new Date(),
    url: mockUrl,
    userId,
    path: `mock_${userId}/${fileId}`
  };
  
  // Store in localStorage
  const files = getStoredFiles(userId);
  files.push(storedFile);
  localStorage.setItem(`files_${userId}`, JSON.stringify(files));
  
  return storedFile;
};

// Save a file to Supabase storage with progress tracking
export const saveFile = async (
  file: File, 
  userId: string,
  onProgress?: (progress: number) => void
): Promise<StoredFile> => {
  // Start progress reporting
  if (onProgress) {
    onProgress(5); // Initial progress to indicate we've started
  }
  
  try {
    console.log(`Preparing to upload file: ${file.name} (${file.size} bytes)`);
    
    const fileId = generateUniqueId();
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/${fileId}.${fileExt}`;
    
    if (onProgress) {
      onProgress(15);
    }
    
    console.log(`Uploading file to path: ${filePath}`);
    
    try {
      // Check if bucket exists
      const { error: bucketError } = await supabase.storage.getBucket('filestorage');
      if (bucketError) {
        console.warn('Storage bucket "filestorage" not found. Falling back to local storage.');
        if (onProgress) onProgress(50);
        
        // If the bucket doesn't exist, fall back to localStorage
        const mockFile = mockSaveFileToLocalStorage(file, userId);
        
        if (onProgress) onProgress(100);
        
        return mockFile;
      }
      
      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('filestorage')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) {
        console.error('Upload error:', uploadError);
        
        // Fall back to localStorage on upload error
        console.warn('Supabase upload failed, falling back to localStorage');
        if (onProgress) onProgress(50);
        
        const mockFile = mockSaveFileToLocalStorage(file, userId);
        
        if (onProgress) onProgress(100);
        return mockFile;
      }
      
      console.log('File uploaded successfully');
      
      if (onProgress) {
        onProgress(75);
      }
      
      // Get the public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('filestorage')
        .getPublicUrl(filePath);
      
      if (!urlData || !urlData.publicUrl) {
        throw new Error('Failed to get public URL for uploaded file');
      }
      
      // Complete progress reporting
      if (onProgress) {
        onProgress(90);
      }
      
      // Store file metadata in localStorage for this example
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
      
      // Store file metadata in localStorage
      const files = getStoredFiles(userId);
      files.push(storedFile);
      localStorage.setItem(`files_${userId}`, JSON.stringify(files));
      
      if (onProgress) {
        onProgress(100);
      }
      
      return storedFile;
    } catch (error) {
      // If specific Supabase upload fails, fallback to localStorage
      console.warn('Supabase upload failed, falling back to localStorage:', error);
      if (onProgress) onProgress(50);
      
      const mockFile = mockSaveFileToLocalStorage(file, userId);
      
      if (onProgress) onProgress(100);
      
      return mockFile;
    }
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
  
  if (!fileToDelete) {
    throw new Error('File not found');
  }
  
  // Check if it's a mock file
  if (fileToDelete.path?.startsWith('mock_')) {
    // Just revoke the object URL if it exists
    if (fileToDelete.url.startsWith('blob:')) {
      URL.revokeObjectURL(fileToDelete.url);
    }
  } else if (fileToDelete.path) {
    try {
      // Delete from Supabase storage
      const { error } = await supabase.storage
        .from('filestorage')
        .remove([fileToDelete.path]);
      
      if (error) {
        console.error('Error deleting file from storage:', error);
      }
    } catch (error) {
      console.warn('Failed to delete from Supabase, continuing with local deletion:', error);
    }
  }
  
  // Update localStorage regardless of Supabase result
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
