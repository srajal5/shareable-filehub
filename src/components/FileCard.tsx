
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Copy, Download, File, FileImage, FileText, FileVideo, FileAudio, Link, MoreVertical, Share2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatFileSize, deleteFile, downloadFile } from '@/utils/fileUtils';
import { useAuth } from '@/context/AuthContext';

interface FileCardProps {
  file: {
    id: string;
    name: string;
    size: number;
    type: string;
    uploadDate: Date;
    url: string;
    path?: string;
    localUrl?: string;
  };
  onDelete: (fileId: string) => void;
  onShare: (fileId: string) => void;
}

const FileCard: React.FC<FileCardProps> = ({ file, onDelete, onShare }) => {
  const { user } = useAuth();
  
  // Determine the file icon based on file type
  const getFileIcon = () => {
    const fileType = file.type.split('/')[0];
    
    switch (fileType) {
      case 'image':
        return <FileImage className="h-5 w-5" />;
      case 'video':
        return <FileVideo className="h-5 w-5" />;
      case 'audio':
        return <FileAudio className="h-5 w-5" />;
      case 'application':
        if (file.name.endsWith('.pdf')) return <FileText className="h-5 w-5" />;
        return <File className="h-5 w-5" />;
      case 'text':
        return <FileText className="h-5 w-5" />;
      default:
        return <File className="h-5 w-5" />;
    }
  };

  // Format the upload date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Handle file deletion
  const handleDelete = async () => {
    if (!user) return;
    
    try {
      await deleteFile(file.id, user.id);
      onDelete(file.id);
      toast.success('File deleted successfully');
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file');
    }
  };

  // Handle file download
  const handleDownload = async () => {
    try {
      await downloadFile(file.id);
      toast.success('Download started');
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file');
    }
  };

  // Handle file sharing
  const handleShare = () => {
    onShare(file.id);
  };

  // Copy shareable link to clipboard
  const copyShareableLink = () => {
    navigator.clipboard.writeText(file.url);
    toast.success('Link copied to clipboard');
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-md bg-muted">
              {getFileIcon()}
            </div>
            <div className="min-w-0">
              <h3 className="font-medium truncate max-w-[200px]">{file.name}</h3>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(file.size)} • {formatDate(file.uploadDate)}
              </p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="-mt-1 -mr-2">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                <span>Share</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={copyShareableLink}>
                <Copy className="mr-2 h-4 w-4" />
                <span>Copy Link</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                <span>Download</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
      
      <CardFooter className="px-4 py-3 bg-muted/40 flex justify-between items-center border-t">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs"
          onClick={handleDownload}
        >
          <Download className="mr-1 h-3 w-3" />
          Download
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs"
          onClick={handleShare}
        >
          <Link className="mr-1 h-3 w-3" />
          Share
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FileCard;
