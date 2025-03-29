import { useState } from 'react';
import FileUploader from './components/FileUploader';
import FileList from './components/FileList';
import ConversionOptions from './components/ConversionOptions';
import { ConversionSettings } from './types';

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [format, setFormat] = useState<'webp' | 'avif'>('webp');
  const [quality, setQuality] = useState(75);
  const [lossless, setLossless] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadReady, setDownloadReady] = useState(false);

  // Remove a file from the list
  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  // Clear all files
  const clearFiles = () => {
    setFiles([]);
    if (downloadUrl) {
      window.URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
      setDownloadReady(false);
    }
  };

  const handleDownload = () => {
    if (!downloadUrl) return;
    
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `converted_images.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Clean up the URL and reset download state
    window.URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);
    setDownloadReady(false);
  };

  const convertFiles = async () => {
    if (files.length === 0) {
      setError('Please add at least one image to convert');
      return;
    }

    // Clear any existing download URL
    if (downloadUrl) {
      window.URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
      setDownloadReady(false);
    }

    setIsConverting(true);
    setProgress(0);
    setError(null);

    try {
      // Create form data
      const formData = new FormData();
      
      // Add files to form data
      files.forEach(file => {
        formData.append('files', file);
      });

      // Add conversion options
      const options: ConversionSettings = {
        format,
        quality: parseFloat(quality.toString()),
        lossless
      };
      formData.append('options', JSON.stringify(options));

      // Make API request
      const response = await fetch('http://localhost:8080/convert', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Server returned ${response.status}`);
      }

      // Create a URL for the zip file instead of automatically downloading
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
      setDownloadReady(true);

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred during conversion');
      }
    } finally {
      setIsConverting(false);
      setProgress(0);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-4">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-blue-700">Image Converter</h1>
        <p className="text-gray-600">Convert your images to WebP or AVIF format</p>
      </header>

      <main className="flex-grow flex flex-col md:flex-row gap-6">
        {/* Left panel - Upload and file list */}
        <div className="flex-1 flex flex-col">
          <FileUploader onFilesAdded={files => setFiles(prev => [...prev, ...files])} />
          
          <FileList 
            files={files} 
            onRemoveFile={removeFile} 
            onClearFiles={clearFiles} 
          />
        </div>

        {/* Right panel - Conversion options */}
        <div className="md:w-80 flex flex-col">
          <ConversionOptions
            format={format}
            setFormat={setFormat}
            quality={quality}
            setQuality={setQuality}
            lossless={lossless}
            setLossless={setLossless}
            isConverting={isConverting}
            filesCount={files.length}
            onConvert={convertFiles}
            progress={progress}
            error={error}
          />

          {/* Download section */}
          {downloadReady && downloadUrl && (
            <div className="mt-4 bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-2 text-green-700">Conversion Complete!</h2>
              <p className="text-sm text-gray-600 mb-3">
                Your images have been converted successfully. Click the button below to download them as a ZIP file.
              </p>
              <button
                onClick={handleDownload}
                className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                type="button"
              >
                Download ZIP
              </button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                The download link will be removed after downloading
              </p>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>©2025 Image Converter - Quickly convert your images to WebP and AVIF</p>
      </footer>
    </div>
  );
}

export default App;