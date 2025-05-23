
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import FileUploader from '@/components/FileUploader';
import FileCard from '@/components/FileCard';
import ShareModal from '@/components/ShareModal';
import { getStoredFiles } from '@/utils/fileUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, Upload, Grid, List, LayoutGrid, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { ensureStorageBucket } from '@/utils/supabaseConfig';

interface StoredFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
  url: string;
}

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [showUploader, setShowUploader] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Load files on component mount and setup storage bucket
  useEffect(() => {
    if (user) {
      const storedFiles = getStoredFiles(user.id);
      setFiles(storedFiles);
      
      // Initialize Supabase storage bucket
      ensureStorageBucket()
        .then(bucketExists => {
          if (!bucketExists) {
            toast.warning(
              "Could not access Supabase storage. Files will be saved locally.",
              { duration: 5000 }
            );
          }
        })
        .catch(() => {
          toast.warning(
            "Could not initialize storage. Files will be saved locally.",
            { duration: 5000 }
          );
        });
    }
  }, [user]);
  
  // Handle file upload
  const handleFileUploaded = (fileId: string) => {
    if (user) {
      const updatedFiles = getStoredFiles(user.id);
      setFiles(updatedFiles);
      setShowUploader(false);
    }
  };
  
  // Handle file deletion
  const handleFileDeleted = (fileId: string) => {
    setFiles(files.filter(file => file.id !== fileId));
  };
  
  // Handle file share
  const handleFileShare = (fileId: string) => {
    const file = files.find(file => file.id === fileId);
    if (file) {
      setSelectedFileId(fileId);
      setSelectedFileName(file.name);
      setShareModalOpen(true);
    }
  };
  
  // Close share modal
  const closeShareModal = () => {
    setShareModalOpen(false);
    setSelectedFileId(null);
  };
  
  // Filter files based on search query
  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <>
      <Navbar />
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Your Files</h1>
            <p className="text-muted-foreground">
              Upload, manage, and share your files securely
            </p>
          </div>
          
          <Button onClick={() => setShowUploader(!showUploader)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload New File
          </Button>
        </div>
        
        {showUploader && (
          <div className="mb-8 bg-muted/40 rounded-lg p-6 border">
            <h2 className="text-xl font-bold mb-4 text-center">Upload a File</h2>
            <FileUploader onFileUploaded={handleFileUploaded} />
          </div>
        )}
        
        <Tabs defaultValue="all" className="mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <TabsList>
              <TabsTrigger value="all">All Files</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="others">Others</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search files..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="border rounded-md flex">
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="icon"
                  className="h-9 w-9 rounded-none rounded-l-md"
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="icon"
                  className="h-9 w-9 rounded-none rounded-r-md"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <TabsContent value="all">
            {filteredFiles.length === 0 ? (
              <div className="text-center py-16 bg-muted/30 rounded-lg border border-dashed">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No files found</h3>
                <p className="text-muted-foreground mb-6">
                  {files.length === 0
                    ? "You haven't uploaded any files yet"
                    : "No files match your search criteria"}
                </p>
                <Button onClick={() => setShowUploader(true)}>
                  Upload Your First File
                </Button>
              </div>
            ) : (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredFiles.map(file => (
                    <FileCard
                      key={file.id}
                      file={file}
                      onDelete={handleFileDeleted}
                      onShare={handleFileShare}
                    />
                  ))}
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  {filteredFiles.map((file, index) => (
                    <div 
                      key={file.id} 
                      className={`flex items-center justify-between p-4 ${
                        index !== filteredFiles.length - 1 ? 'border-b' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-md bg-muted">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium">{file.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB • {new Date(file.uploadDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleFileShare(file.id)}
                        >
                          Share
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </TabsContent>
          
          <TabsContent value="images">
            {/* Image filter logic - simplified for this example */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredFiles
                .filter(file => file.type.startsWith('image/'))
                .map(file => (
                  <FileCard
                    key={file.id}
                    file={file}
                    onDelete={handleFileDeleted}
                    onShare={handleFileShare}
                  />
                ))
              }
            </div>
          </TabsContent>
          
          <TabsContent value="documents">
            {/* Document filter logic - simplified for this example */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredFiles
                .filter(file => 
                  file.type.includes('pdf') || 
                  file.type.includes('document') || 
                  file.type.includes('text/')
                )
                .map(file => (
                  <FileCard
                    key={file.id}
                    file={file}
                    onDelete={handleFileDeleted}
                    onShare={handleFileShare}
                  />
                ))
              }
            </div>
          </TabsContent>
          
          <TabsContent value="others">
            {/* Other files filter logic - simplified for this example */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredFiles
                .filter(file => 
                  !file.type.startsWith('image/') && 
                  !file.type.includes('pdf') && 
                  !file.type.includes('document') && 
                  !file.type.includes('text/')
                )
                .map(file => (
                  <FileCard
                    key={file.id}
                    file={file}
                    onDelete={handleFileDeleted}
                    onShare={handleFileShare}
                  />
                ))
              }
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <ShareModal
        isOpen={shareModalOpen}
        fileId={selectedFileId}
        fileName={selectedFileName}
        onClose={closeShareModal}
      />
    </>
  );
};

export default Dashboard;
