// Create a new file called QualityPresetDropdown.tsx

import React from 'react';

export interface QualityPreset {
  label: string;
  quality: number;
  speed: number;
  description: string;
}

interface QualityPresetDropdownProps {
  format: 'webp' | 'avif';
  setQuality: (quality: number) => void;
  setSpeed?: (speed: number) => void;
}

const QualityPresetDropdown: React.FC<QualityPresetDropdownProps> = ({ 
  format, 
  setQuality, 
  setSpeed 
}) => {
  // Only show for AVIF format
  if (format !== 'avif' || !setSpeed) return null;

  const presets: QualityPreset[] = [
    { 
      label: "Maximum Quality", 
      quality: 1, 
      speed: 1,
      description: "Highest quality, larger file size. Good for archival."
    },
    { 
      label: "High Quality", 
      quality: 15, 
      speed: 3,
      description: "High quality with good compression. Ideal for most web images."
    },
    { 
      label: "Balanced", 
      quality: 25, 
      speed: 5,
      description: "Good quality with better compression. Works well for general website images."
    },
    { 
      label: "Efficient", 
      quality: 40, 
      speed: 6,
      description: "Decent quality with excellent compression. Good for thumbnails."
    },
    { 
      label: "Small Size", 
      quality: 55, 
      speed: 8,
      description: "Lower quality but smallest file size. Use for non-critical images."
    }
  ];

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPreset = presets[parseInt(e.target.value)];
    setQuality(selectedPreset.quality);
    setSpeed(selectedPreset.speed);
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Quality Presets
      </label>
      <select 
        onChange={handlePresetChange}
        className="block w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
      >
        <option value="" disabled selected>Select a preset</option>
        {presets.map((preset, index) => (
          <option key={preset.label} value={index}>
            {preset.label} (Quality: {preset.quality}, Speed: {preset.speed})
          </option>
        ))}
      </select>
      <p className="text-xs text-gray-500 mt-1">
        Choose a preset or adjust quality and speed manually
      </p>
    </div>
  );
};

export default QualityPresetDropdown;