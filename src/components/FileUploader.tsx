
import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import { Upload, X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { saveFile } from '@/utils/fileUtils';
import { useAuth } from '@/context/AuthContext';

interface FileUploaderProps {
  onFileUploaded: (fileId: string) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUploaded }) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  // Handle file selection
  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  // Simulate file upload with progress
  const uploadFile = async () => {
    if (!selectedFile || !user) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 200);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    clearInterval(interval);
    setUploadProgress(100);
    
    try {
      // Save the file (in a real app this would be an API call to upload)
      const storedFile = saveFile(selectedFile, user.id);
      
      // Notify the parent component
      onFileUploaded(storedFile.id);
      
      // Show success message
      toast.success('File uploaded successfully');
      
      // Clear the selected file after upload is complete
      setTimeout(() => {
        setSelectedFile(null);
        setUploadProgress(0);
        setIsUploading(false);
      }, 500);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file. Please try again.');
      setIsUploading(false);
    }
  };

  // Handle drag events
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Remove selected file
  const removeSelectedFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!selectedFile ? (
        <div
          className={`file-drop-area ${isDragging ? 'dragging' : 'border-muted'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            className="hidden"
          />
          <div className="flex flex-col items-center">
            <div className="p-4 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 mb-4">
              <Upload size={32} />
            </div>
            <h3 className="text-lg font-medium mb-2">Upload a File</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Drag and drop or click to browse
            </p>
            <Button variant="outline" size="sm">Select File</Button>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-md bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400">
                <FileText size={24} />
              </div>
              <div>
                <h3 className="font-medium truncate max-w-xs">{selectedFile.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            {!isUploading && (
              <Button
                variant="ghost"
                size="icon"
                onClick={removeSelectedFile}
                className="text-muted-foreground"
              >
                <X size={18} />
              </Button>
            )}
          </div>
          
          {isUploading ? (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="h-2" />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Uploading...</span>
                <span className="font-medium">{Math.round(uploadProgress)}%</span>
              </div>
            </div>
          ) : (
            <Button 
              onClick={uploadFile} 
              className="w-full"
            >
              Upload File
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
