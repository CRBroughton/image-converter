interface FormatSelectorProps {
  format: 'webp' | 'avif';
  setFormat: (format: 'webp' | 'avif') => void;
}

const FormatSelector = ({ format, setFormat }: FormatSelectorProps) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-medium mb-2">
        Output Format
      </label>
      <div className="flex gap-4">
        <label className="inline-flex items-center">
          <input
            type="radio"
            className="form-radio text-blue-600"
            name="format"
            value="webp"
            checked={format === 'webp'}
            onChange={() => setFormat('webp')}
          />
          <span className="ml-2">WebP</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            className="form-radio text-blue-600"
            name="format"
            value="avif"
            checked={format === 'avif'}
            onChange={() => setFormat('avif')}
          />
          <span className="ml-2">AVIF</span>
        </label>
      </div>
    </div>
  );
};

export default FormatSelector;