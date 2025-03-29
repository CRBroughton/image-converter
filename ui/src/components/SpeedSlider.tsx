interface SpeedSliderProps {
    speed: number;
    setSpeed: (speed: number) => void;
}

const SpeedSlider = ({ speed, setSpeed }: SpeedSliderProps) => {
    const minSpeed = 0;
    const maxSpeed = 8;

    const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(e.target.value);
        setSpeed(newValue);
    };

    return (
        <div className="mb-4">
            <div className="flex justify-between">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                    Encoding Speed
                </label>
                <span className="text-sm font-medium text-blue-600">
                    {speed}
                </span>
            </div>
            <input
                type="range"
                min={minSpeed}
                max={maxSpeed}
                value={speed}
                onChange={handleSpeedChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Better compression</span>
                <span>Faster encoding</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
                AVIF speed range: 0-8 (higher = faster but larger file size)
            </p>
        </div>
    );
};

export default SpeedSlider;