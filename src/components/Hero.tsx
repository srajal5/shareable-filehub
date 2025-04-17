
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Upload, Share2, Shield } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-hero-pattern opacity-10 z-0"></div>
      
      <div className="container relative z-10 pt-20 pb-24 md:pt-32 md:pb-40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
              <span className="block">Share Your Files</span>
              <span className="block text-brand-600">Simply & Securely</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-md">
              Upload, store, and share your files with just a few clicks. 
              Generate unique links instantly and share with anyone.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started — It's Free
                </Button>
              </Link>
              <Link to="/features">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-1 text-brand-500" />
                <span>Secure</span>
              </div>
              <div className="h-1 w-1 rounded-full bg-muted-foreground/40"></div>
              <div className="flex items-center">
                <Upload className="h-4 w-4 mr-1 text-brand-500" />
                <span>Easy Upload</span>
              </div>
              <div className="h-1 w-1 rounded-full bg-muted-foreground/40"></div>
              <div className="flex items-center">
                <Share2 className="h-4 w-4 mr-1 text-brand-500" />
                <span>Instant Sharing</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-radial from-brand-200/20 to-transparent rounded-full blur-xl"></div>
            <div className="relative bg-gradient-to-br from-white to-brand-50 dark:from-gray-800 dark:to-gray-900 shadow-xl rounded-xl border overflow-hidden">
              <div className="p-1">
                <div className="flex items-center space-x-1 h-6">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
              </div>
              <div className="p-6">
                <div className="rounded-lg border border-border/50 bg-background/50 shadow-sm p-4 mb-4">
                  <div className="space-y-2">
                    <div className="h-2 w-24 bg-muted rounded animate-pulse-slow"></div>
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded bg-brand-400 flex items-center justify-center text-white">
                        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2">
                          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                          <path d="M13 2v7h7" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="h-2 w-24 bg-muted rounded animate-pulse-slow"></div>
                        <div className="h-2 w-16 bg-muted rounded mt-1 animate-pulse-slow delay-75"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg border border-brand-200 bg-brand-50/50 dark:bg-brand-900/10 dark:border-brand-800/30 p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <div className="text-sm font-medium text-brand-700 dark:text-brand-300">Ready to share!</div>
                      <div className="h-5 w-5 rounded-full bg-brand-500 flex items-center justify-center animate-pulse-slow">
                        <svg viewBox="0 0 24 24" className="h-3 w-3 text-white" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                    </div>
                    <div className="flex items-center text-xs bg-white dark:bg-gray-800 rounded border px-2 py-1">
                      <span className="text-muted-foreground mr-1">https://filehub.io/share/</span>
                      <span className="text-brand-600 font-medium">a7x92k</span>
                    </div>
                    <div className="flex">
                      <div className="flex-1 h-7 bg-brand-500 text-white text-xs rounded-l flex items-center justify-center">
                        Copy Link
                      </div>
                      <div className="h-7 w-7 bg-brand-600 rounded-r flex items-center justify-center text-white">
                        <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3" stroke="currentColor" strokeWidth="2">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
