interface QualitySliderProps {
  quality: number;
  setQuality: (quality: number) => void;
}

const QualitySlider = ({ quality, setQuality }: QualitySliderProps) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Quality
        </label>
        <span className="text-sm font-medium text-blue-600">
          {quality}%
        </span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={quality}
        onChange={(e) => setQuality(parseInt(e.target.value, 10))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>Lower size</span>
        <span>Better quality</span>
      </div>
    </div>
  );
};

export default QualitySlider;