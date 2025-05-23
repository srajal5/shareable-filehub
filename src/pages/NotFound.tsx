
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileX } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Determine if this is a file not found error
  const isFileNotFoundError = location.pathname === "/file-not-available" || 
                              location.pathname.includes("file-not-found");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center px-4 py-10 bg-white rounded-lg shadow-md max-w-md w-full">
        {isFileNotFoundError ? (
          <>
            <div className="mx-auto p-3 bg-red-50 rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <FileX className="h-8 w-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold mb-2">File Not Available</h1>
            <p className="text-gray-600 mb-6">
              The file you're trying to access is not available. It may have been deleted or the storage bucket hasn't been created yet.
            </p>
            <div className="space-y-3">
              <p className="text-sm text-gray-500 mb-4">
                If you're a developer, make sure the "File Storage" bucket exists in your Supabase project.
              </p>
              <Button asChild className="w-full">
                <Link to="/dashboard">Return to Dashboard</Link>
              </Button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
            <Button asChild>
              <Link to="/">Return to Home</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default NotFound;
