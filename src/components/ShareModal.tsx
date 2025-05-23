
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check, Share2, Link as LinkIcon, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { getFileById, generateShareableLink } from '@/utils/fileUtils';

interface ShareModalProps {
  isOpen: boolean;
  fileId: string | null;
  fileName: string;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, fileId, fileName, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [shareableLink, setShareableLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const getShareableLink = async () => {
      if (!fileId) return;
      
      setIsLoading(true);
      
      try {
        const file = getFileById(fileId);
        if (file) {
          const link = await generateShareableLink(file.path || '', file.localUrl);
          setShareableLink(link);
        } else {
          setShareableLink('File not found');
        }
      } catch (error) {
        console.error("Error generating shareable link:", error);
        setShareableLink('Error generating link');
        toast.error("Couldn't generate shareable link");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isOpen && fileId) {
      getShareableLink();
    }
  }, [fileId, isOpen]);
  
  // Copy link to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      setCopied(true);
      toast.success('Link copied to clipboard');
      
      // Reset the copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast.error('Failed to copy link');
    }
  };
  
  // Send email (mock function)
  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter an email address');
      return;
    }
    
    // In a real app, this would call an API to send an email
    toast.success(`Invite sent to ${email}`);
    setEmail('');
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-brand-500" />
            Share File
          </DialogTitle>
          <DialogDescription>
            Share "{fileName}" with others via link or email.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="link">Shareable Link</Label>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="link" 
                  value={isLoading ? "Generating link..." : shareableLink} 
                  readOnly 
                  className="pl-9 pr-20 text-sm truncate"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7"
                  onClick={copyToClipboard}
                  disabled={isLoading}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Share via Email</Label>
            <form onSubmit={sendEmail} className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Enter recipient's email" 
                  className="pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button type="submit" size="sm">
                Send
              </Button>
            </form>
          </div>
        </div>
        
        <DialogFooter className="flex space-x-2 sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button type="button" onClick={copyToClipboard} disabled={isLoading}>
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
