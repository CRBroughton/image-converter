import { useRef, useState, ChangeEvent } from 'react';

interface FileUploaderProps {
  onFilesAdded: (files: File[]) => void;
}

const FileUploader = ({ onFilesAdded }: FileUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Handle file selection
  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    
    setIsUploading(true);

    try {
      
      const selectedFiles = Array.from(event.target.files);
      // Filter only image files
      const imageFiles = selectedFiles.filter(file => 
        file.type.startsWith('image/'));
      
      if (imageFiles.length > 0) {
        // Small delay to show the uploading state (can remove in production)
        await new Promise(resolve => setTimeout(resolve, 700));
        onFilesAdded(imageFiles);
      }
    } catch (error) {
      console.error('Error processing files:', error);
    } finally {
      event.target.value = '';
      setIsUploading(false);
    }
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      {/* File input (hidden) */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        multiple
        accept="image/*"
        className="hidden"
        disabled={isUploading}
      />
      
      {/* File selection button */}
      <button
        onClick={triggerFileSelect}
        className={`w-full border-2 font-medium rounded-lg py-4 px-6 mb-4 transition-colors ${
          isUploading 
            ? 'bg-blue-50 border-blue-300 text-blue-400 cursor-wait' 
            : 'bg-white border-blue-500 text-blue-600 hover:bg-blue-50'
        }`}
        type="button"
        disabled={isUploading}
      >
        <div className="flex items-center justify-center">
          {isUploading ? (
            <>
              <svg 
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-400" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                ></circle>
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Uploading...
            </>
          ) : (
            <>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              </svg>
              Select Images
            </>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {isUploading 
            ? "Processing your images..." 
            : "Supported formats: JPEG, PNG, GIF, BMP, WebP"}
        </p>
      </button>
    </>
  );
};

export default FileUploader;