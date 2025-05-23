import FormatSelector from './FormatSelector';
import QualitySlider from './QualitySlider';
import SpeedSlider from './SpeedSlider';
import QualityPresetDropdown from './QualityPresetDropdown';

interface ConversionOptionsProps {
  format: 'webp' | 'avif';
  setFormat: (format: 'webp' | 'avif') => void;
  quality: number;
  setQuality: (quality: number) => void;
  lossless: boolean;
  setLossless: (lossless: boolean) => void;
  isConverting: boolean;
  filesCount: number;
  onConvert: () => void;
  progress: number;
  error: string | null;
  speed: number;
  setSpeed?: (speed: number) => void;
}

const ConversionOptions = ({
  format,
  setFormat,
  quality,
  setQuality,
  lossless,
  setLossless,
  isConverting,
  filesCount,
  onConvert,
  error,
  setSpeed,
  speed = 5,
}: ConversionOptionsProps) => {
  return (
    <div className="md:w-80 bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Conversion Options</h2>

      <FormatSelector
        format={format}
        setFormat={(newFormat) => {
          setFormat(newFormat);
          if (newFormat === 'avif' && quality > 63) {
            setQuality(63);
          }
        }}
      />

      {format === 'avif' && setSpeed && (
        <QualityPresetDropdown
          format={format}
          setQuality={setQuality}
          setSpeed={setSpeed}
        />
      )}

      <QualitySlider
        quality={quality}
        setQuality={setQuality}
        format={format}
      />

      {format === 'avif' && setSpeed && (
        <SpeedSlider
          speed={speed}
          setSpeed={setSpeed}
        />
      )}

      {format === 'webp' && (
        <div className="mb-6">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="form-checkbox text-blue-600"
              checked={lossless}
              onChange={(e) => setLossless(e.target.checked)}
            />
            <span className="ml-2 text-gray-700 text-sm font-medium">
              Lossless compression
            </span>
          </label>
          <p className="text-xs text-gray-500 mt-1 ml-6">
            Better quality but larger file size
          </p>
        </div>
      )}
      <button
        onClick={onConvert}
        disabled={isConverting || filesCount === 0}
        className={`w-full py-2 px-4 rounded-lg text-white font-medium
          ${isConverting || filesCount === 0
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
          }`}
        type="button"
      >
        {isConverting ? 'Converting...' : 'Convert Images'}
      </button>

      {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 text-sm rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default ConversionOptions;