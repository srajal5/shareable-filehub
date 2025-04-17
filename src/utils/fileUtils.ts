
// Generate a unique ID for files
export const generateUniqueId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
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

// Generate a sharing URL
export const generateShareableLink = (fileId: string): string => {
  // In a real app, this would create a proper URL based on your deployment
  return `${window.location.origin}/share/${fileId}`;
};

// Mock file storage (in a real app, this would interact with a database)
interface StoredFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
  url: string; // In a real app, this would be a URL to the stored file
  userId: string;
}

// Get stored files from localStorage
export const getStoredFiles = (userId: string): StoredFile[] => {
  const filesJson = localStorage.getItem(`files_${userId}`);
  return filesJson ? JSON.parse(filesJson) : [];
};

// Save a file to "storage" (localStorage in this mock)
export const saveFile = (file: File, userId: string): StoredFile => {
  const fileId = generateUniqueId();
  const files = getStoredFiles(userId);
  
  const storedFile: StoredFile = {
    id: fileId,
    name: file.name,
    size: file.size,
    type: file.type,
    uploadDate: new Date(),
    url: URL.createObjectURL(file), // In a real app, this would be a server URL
    userId,
  };
  
  files.push(storedFile);
  localStorage.setItem(`files_${userId}`, JSON.stringify(files));
  
  return storedFile;
};

// Delete a file
export const deleteFile = (fileId: string, userId: string): void => {
  const files = getStoredFiles(userId);
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
