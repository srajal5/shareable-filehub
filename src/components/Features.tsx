
import React from 'react';
import { Upload, Lock, Share2, Clock, Zap, Globe, Shield, Smartphone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <Card className="border border-border/50 transition-all hover:shadow-md hover:border-brand-200 dark:hover:border-brand-800">
    <CardHeader className="pb-2">
      <div className="bg-brand-100 dark:bg-brand-900/30 rounded-full w-10 h-10 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-2">
        {icon}
      </div>
      <CardTitle className="text-xl">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <CardDescription className="text-base">{description}</CardDescription>
    </CardContent>
  </Card>
);

const Features: React.FC = () => {
  const features = [
    {
      icon: <Upload size={20} />,
      title: 'Easy Uploads',
      description: 'Drag and drop or browse to upload any file type with our simple interface.'
    },
    {
      icon: <Lock size={20} />,
      title: 'Secure Storage',
      description: 'Your files are securely stored with industry-standard encryption.'
    },
    {
      icon: <Share2 size={20} />,
      title: 'Quick Sharing',
      description: 'Generate unique links instantly and share your files with anyone.'
    },
    {
      icon: <Clock size={20} />,
      title: 'File Management',
      description: 'Organize, track, and manage all your shared files from one dashboard.'
    },
    {
      icon: <Zap size={20} />,
      title: 'Fast Transfers',
      description: 'Experience lightning-fast upload and download speeds for efficient file sharing.'
    },
    {
      icon: <Globe size={20} />,
      title: 'Access Anywhere',
      description: 'Access your files from any device, anywhere in the world with an internet connection.'
    },
    {
      icon: <Shield size={20} />,
      title: 'Privacy Controls',
      description: 'Set expiration dates, password protection, and download limits for your shared files.'
    },
    {
      icon: <Smartphone size={20} />,
      title: 'Mobile Friendly',
      description: 'Our responsive design works perfectly on all devices, from desktops to smartphones.'
    },
  ];

  return (
    <section className="py-20 bg-secondary/50">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful File Sharing Made Simple</h2>
          <p className="text-lg text-muted-foreground">
            FileHub provides all the tools you need to securely share and manage your files
            with an intuitive, easy-to-use interface.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
