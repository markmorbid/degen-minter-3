'use client';

import { useState, useEffect } from 'react';
import imageCompression from 'browser-image-compression';

interface QualitySliderProps {
  originalFile: File | null;
  onCompressedFile: (file: File, isCompressing: boolean) => void;
  disabled?: boolean;
}

export default function QualitySlider({ 
  originalFile, 
  onCompressedFile, 
  disabled 
}: QualitySliderProps) {
  const [quality, setQuality] = useState(100);
  const [isCompressing, setIsCompressing] = useState(false);
  const [showCompressing, setShowCompressing] = useState(false);

  // Reset quality when new file is uploaded
  useEffect(() => {
    if (originalFile) {
      setQuality(100);
      // At 100%, use original file without compression
      onCompressedFile(originalFile, false);
    }
  }, [originalFile]);

  const compressImage = async (file: File, qualityValue: number) => {
    if (qualityValue === 100) {
      // Skip compression at 100% quality
      onCompressedFile(file, false);
      return;
    }

    setIsCompressing(true);
    
    // Show "Compressing..." only if it takes more than 200ms
    const timer = setTimeout(() => {
      setShowCompressing(true);
    }, 200);

    try {
      const options = {
        maxSizeMB: 0.4, // Target 400kb max
        maxWidthOrHeight: 2048,
        useWebWorker: true,
        initialQuality: qualityValue / 100,
        quality: qualityValue / 100,
        alwaysKeepResolution: false,
      };

      const compressedFile = await imageCompression(file, options);
      
      // Create a new File object with the original name
      const newFile = new File([compressedFile], file.name, {
        type: file.type,
      });

      clearTimeout(timer);
      setShowCompressing(false);
      onCompressedFile(newFile, false);
    } catch (error) {
      console.error('Compression failed:', error);
      clearTimeout(timer);
      setShowCompressing(false);
      onCompressedFile(file, false);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuality(Number(e.target.value));
  };

  const handleSliderRelease = () => {
    if (originalFile) {
      compressImage(originalFile, quality);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold text-white">🎚️ Quality Slider</h2>
        <span className="text-xl font-bold text-bitcoin">{quality}%</span>
      </div>
      
      <p className="text-gray-400 text-sm mb-4">
        Adjust quality to compress your image (200kb-400kb required)
      </p>

      <div className="relative">
        <input
          type="range"
          min="1"
          max="100"
          step="1"
          value={quality}
          onChange={handleSliderChange}
          onMouseUp={handleSliderRelease}
          onTouchEnd={handleSliderRelease}
          disabled={disabled || !originalFile}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: `linear-gradient(to right, #F7931A 0%, #F7931A ${quality}%, #374151 ${quality}%, #374151 100%)`,
          }}
        />
        
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>1%</span>
          <span>100%</span>
        </div>
      </div>

      {showCompressing && (
        <div className="mt-4 text-center text-bitcoin animate-pulse">
          Compressing...
        </div>
      )}

      {!originalFile && (
        <p className="mt-4 text-gray-500 text-sm text-center">
          Upload a file to use the quality slider
        </p>
      )}
    </div>
  );
}
