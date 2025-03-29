import { useRef, ChangeEvent } from 'react';

interface FileUploaderProps {
  onFilesAdded: (files: File[]) => void;
}

const FileUploader = ({ onFilesAdded }: FileUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const selectedFiles = Array.from(event.target.files);
    // Filter only image files
    const imageFiles = selectedFiles.filter(file =>
      file.type.startsWith('image/'));

    if (imageFiles.length > 0) {
      onFilesAdded(imageFiles);
    }

    event.target.value = '';
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        multiple
        accept="image/*"
        className="hidden"
      />

      <button
        onClick={triggerFileSelect}
        className="w-full bg-white border-2 border-blue-500 text-blue-600 font-medium 
                  rounded-lg py-4 px-6 mb-4 hover:bg-blue-50 transition-colors"
        type="button"
      >
        <div className="flex items-center justify-center">
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
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Supported formats: JPEG, PNG, GIF, BMP, WebP
        </p>
      </button>
    </>
  );
};

export default FileUploader;