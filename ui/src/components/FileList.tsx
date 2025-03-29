import FileListItem from './FileListItem';

interface FileListProps {
  files: File[];
  onRemoveFile: (index: number) => void;
  onClearFiles: () => void;
}

const FileList = ({ files, onRemoveFile, onClearFiles }: FileListProps) => {
  return (
    <div className="flex-grow bg-white rounded-lg shadow p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Files ({files.length})</h2>
        {files.length > 0 && (
          <button
            onClick={onClearFiles}
            className="text-sm text-red-500 hover:text-red-700"
            type="button"
          >
            Clear All
          </button>
        )}
      </div>

      {files.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No files selected yet
        </p>
      ) : (
        <ul className="space-y-2">
          {files.map((file, index) => (
            <FileListItem
              key={index}
              file={file}
              onRemove={() => onRemoveFile(index)}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileList;