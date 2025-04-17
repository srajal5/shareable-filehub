
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        
        <Features />
        
        {/* How It Works Section */}
        <section className="py-20">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How FileHub Works</h2>
              <p className="text-lg text-muted-foreground">
                Sharing files has never been easier. Just three simple steps to get your files to anyone, anywhere.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center text-brand-600 dark:text-brand-400 mb-6">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Upload Your File</h3>
                <p className="text-muted-foreground">
                  Select or drag and drop any file into the upload area. We support all file types up to 2GB.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center text-brand-600 dark:text-brand-400 mb-6">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Get Your Unique Link</h3>
                <p className="text-muted-foreground">
                  Once uploaded, we'll generate a secure, unique link for your file that's ready to share.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center text-brand-600 dark:text-brand-400 mb-6">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Share With Anyone</h3>
                <p className="text-muted-foreground">
                  Share your link via email, chat, or any other platform. Recipients don't need an account to download.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Pricing Section */}
        <section className="py-20 bg-secondary/50">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
              <p className="text-lg text-muted-foreground">
                Choose the plan that works for you. Start free, upgrade when you need to.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Free Plan */}
              <div className="border rounded-lg overflow-hidden bg-background shadow-sm transition-all hover:shadow-md">
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-1">Free</h3>
                  <p className="text-muted-foreground text-sm mb-4">For casual users</p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">$0</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center">
                      <CheckCircle className="text-brand-500 mr-2 h-5 w-5" />
                      <span>500MB storage</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-brand-500 mr-2 h-5 w-5" />
                      <span>Max file size: 100MB</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-brand-500 mr-2 h-5 w-5" />
                      <span>Basic sharing options</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-brand-500 mr-2 h-5 w-5" />
                      <span>7-day file retention</span>
                    </li>
                  </ul>
                  <Link to="/signup">
                    <Button variant="outline" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
              
              {/* Pro Plan */}
              <div className="border rounded-lg overflow-hidden bg-background shadow-md relative">
                <div className="absolute top-0 inset-x-0 h-1 bg-brand-500"></div>
                <div className="absolute top-5 right-5">
                  <span className="bg-brand-100 text-brand-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Popular</span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-1">Pro</h3>
                  <p className="text-muted-foreground text-sm mb-4">For individuals & professionals</p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">$9</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center">
                      <CheckCircle className="text-brand-500 mr-2 h-5 w-5" />
                      <span>25GB storage</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-brand-500 mr-2 h-5 w-5" />
                      <span>Max file size: 2GB</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-brand-500 mr-2 h-5 w-5" />
                      <span>Advanced sharing controls</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-brand-500 mr-2 h-5 w-5" />
                      <span>Password protection</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-brand-500 mr-2 h-5 w-5" />
                      <span>30-day file retention</span>
                    </li>
                  </ul>
                  <Link to="/signup">
                    <Button className="w-full">
                      Choose Pro
                    </Button>
                  </Link>
                </div>
              </div>
              
              {/* Business Plan */}
              <div className="border rounded-lg overflow-hidden bg-background shadow-sm transition-all hover:shadow-md">
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-1">Business</h3>
                  <p className="text-muted-foreground text-sm mb-4">For teams & organizations</p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">$29</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center">
                      <CheckCircle className="text-brand-500 mr-2 h-5 w-5" />
                      <span>100GB storage</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-brand-500 mr-2 h-5 w-5" />
                      <span>Max file size: 10GB</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-brand-500 mr-2 h-5 w-5" />
                      <span>Team collaboration tools</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-brand-500 mr-2 h-5 w-5" />
                      <span>Advanced security features</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-brand-500 mr-2 h-5 w-5" />
                      <span>Unlimited file retention</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="text-brand-500 mr-2 h-5 w-5" />
                      <span>Priority support</span>
                    </li>
                  </ul>
                  <Link to="/signup">
                    <Button variant="outline" className="w-full">
                      Contact Sales
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-hero-pattern text-white">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Sharing Your Files Today</h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
              Join thousands of users who trust FileHub for their file sharing needs.
              No credit card required to get started.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" variant="secondary" className="min-w-[160px]">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/features">
                <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10 min-w-[160px]">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <svg 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  className="h-8 w-8 text-brand-600"
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>
                </svg>
                <span className="font-bold text-xl">FileHub</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Secure file sharing, simplified.
                Share any file with anyone, anywhere.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/features" className="text-muted-foreground hover:text-foreground transition">Features</Link></li>
                <li><Link to="/pricing" className="text-muted-foreground hover:text-foreground transition">Pricing</Link></li>
                <li><Link to="/security" className="text-muted-foreground hover:text-foreground transition">Security</Link></li>
                <li><Link to="/faq" className="text-muted-foreground hover:text-foreground transition">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="text-muted-foreground hover:text-foreground transition">About Us</Link></li>
                <li><Link to="/contact" className="text-muted-foreground hover:text-foreground transition">Contact</Link></li>
                <li><Link to="/blog" className="text-muted-foreground hover:text-foreground transition">Blog</Link></li>
                <li><Link to="/careers" className="text-muted-foreground hover:text-foreground transition">Careers</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/terms" className="text-muted-foreground hover:text-foreground transition">Terms of Service</Link></li>
                <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground transition">Privacy Policy</Link></li>
                <li><Link to="/cookie-policy" className="text-muted-foreground hover:text-foreground transition">Cookie Policy</Link></li>
                <li><Link to="/gdpr" className="text-muted-foreground hover:text-foreground transition">GDPR Compliance</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} FileHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
