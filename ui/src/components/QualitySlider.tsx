interface QualitySliderProps {
  quality: number;
  setQuality: (quality: number) => void;
  format: 'webp' | 'avif';
}

const QualitySlider = ({ quality, setQuality, format }: QualitySliderProps) => {
  const maxQuality = format === 'avif' ? 63 : 100;
  
  const qualityLabel = format === 'avif' 
    ? `${quality}` 
    : `${quality}%`;

  const handleQualityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    setQuality(newValue);
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Quality
        </label>
        <span className="text-sm font-medium text-blue-600">
          {qualityLabel}
        </span>
      </div>
      <input
        type="range"
        min="0"
        max={maxQuality}
        value={quality}
        onChange={handleQualityChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>Lower size</span>
        <span>Better quality</span>
      </div>
      {format === 'avif' && (
        <p className="text-xs text-gray-500 mt-1">
          AVIF quality range: 0-63
        </p>
      )}
    </div>
  );
};

export default QualitySlider;