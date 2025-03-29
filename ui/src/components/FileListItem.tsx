interface FileListItemProps {
  file: File;
  onRemove: () => void;
}

const FileListItem = ({ file, onRemove }: FileListItemProps) => {
  return (
    <li className="flex items-center justify-between p-2 border rounded">
      <div className="flex items-center">
        <div className="h-10 w-10 bg-gray-200 rounded overflow-hidden mr-3">
          <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="overflow-hidden">
          <p className="text-sm font-medium truncate" title={file.name}>
            {file.name}
          </p>
          <p className="text-xs text-gray-500">
            {(file.size / 1024).toFixed(1)} KB
          </p>
        </div>
      </div>
      <button
        onClick={onRemove}
        className="text-gray-400 hover:text-red-500"
        title="Remove file"
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </li>
  );
};

export default FileListItem;