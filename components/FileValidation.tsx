'use client';

import { useState, useEffect } from 'react';
import imageCompression from 'browser-image-compression';
import { formatFileSize, isFileSizeValid } from '@/lib/api';

interface FileValidationProps {
  originalFile: File | null;
  onCompressedFile: (file: File, isCompressing: boolean) => void;
}

export default function FileValidation({ 
  originalFile, 
  onCompressedFile
}: FileValidationProps) {
  const [quality, setQuality] = useState(100);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [showCompressing, setShowCompressing] = useState(false);

  // Reset quality when new file is uploaded
  useEffect(() => {
    if (originalFile) {
      setQuality(100);
      setCompressedFile(originalFile);
      onCompressedFile(originalFile, false);
    }
  }, [originalFile]);

  const compressImage = async (file: File, qualityValue: number) => {
    if (qualityValue === 100) {
      // Skip compression at 100% quality
      setCompressedFile(file);
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

      const compressed = await imageCompression(file, options);
      
      // Create a new File object with the original name
      const newFile = new File([compressed], file.name, {
        type: file.type,
      });

      clearTimeout(timer);
      setShowCompressing(false);
      setCompressedFile(newFile);
      onCompressedFile(newFile, false);
    } catch (error) {
      console.error('Compression failed:', error);
      clearTimeout(timer);
      setShowCompressing(false);
      setCompressedFile(file);
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

  if (!originalFile) {
    return null;
  }

  const originalSize = originalFile.size;
  const compressedSize = compressedFile?.size || originalSize;
  const isValid = isFileSizeValid(compressedSize);

  const getHelperText = () => {
    if (isCompressing) {
      return 'Compressing...';
    }
    if (compressedSize < 200 * 1024) {
      return 'File too small. Increase quality slider.';
    }
    if (compressedSize > 400 * 1024) {
      return 'File too large. Decrease quality slider.';
    }
    return 'File size is valid! Ready to calculate.';
  };

  return (
    <div className={`
      bg-gray-800 rounded-lg p-6 shadow-lg border-2 transition-colors
      ${isValid ? 'border-green-500' : 'border-red-500'}
    `}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">✅ File Validation</h2>
        <div className={`text-3xl ${isValid ? 'text-green-500' : 'text-red-500'}`}>
          {isValid ? '✓' : '✗'}
        </div>
      </div>

      {/* Quality Slider */}
      <div className="mb-6 pb-6 border-b border-gray-700">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-white">🎚️ Quality Slider</h3>
          <span className="text-xl font-bold text-bitcoin">{quality}%</span>
        </div>
        
        <p className="text-gray-400 text-sm mb-3">
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
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
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
          <div className="mt-3 text-center text-bitcoin animate-pulse">
            Compressing...
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Original Size:</span>
          <span className="text-white font-semibold">{formatFileSize(originalSize)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400">Compressed Size:</span>
          <span className={`font-semibold ${isValid ? 'text-green-400' : 'text-red-400'}`}>
            {formatFileSize(compressedSize)}
          </span>
        </div>

        <div className="pt-2 border-t border-gray-700">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Valid Range:</span>
            <span className="text-gray-300">200kb - 400kb</span>
          </div>
        </div>

        <div className={`
          mt-4 p-3 rounded text-sm font-medium text-center
          ${isValid ? 'bg-green-900/50 text-green-200' : 'bg-red-900/50 text-red-200'}
        `}>
          {getHelperText()}
        </div>
      </div>

      {compressedFile && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-gray-400 text-sm mb-2">Preview:</p>
          <img 
            src={URL.createObjectURL(compressedFile)} 
            alt="Preview" 
            className="w-full max-w-md mx-auto rounded-lg"
          />
        </div>
      )}
    </div>
  );
}
