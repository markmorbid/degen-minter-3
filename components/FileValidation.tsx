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
      degent-card
      ${isValid ? 'border-degent-green/50' : 'border-red-500/50'}
    `}>
    <h2 className="degent-title h2">
        <span className={`icon-square ${isValid ? 'bg-degent-green/20' : 'bg-red-500/20'}`}>
          <i className={`fas ${isValid ? 'fa-check-circle' : 'fa-times-circle'} ${isValid ? 'text-degent-green' : 'text-red-500'}`}></i>
        </span>
        File Validation
        <div className={`status ${isValid ? 'text-degent-green' : 'text-red-500'}`}>
          <i className={`fas ${isValid ? 'fa-check' : 'fa-times'}`}></i>
        </div>
      </h2>
        
      {/* Quality Slider */}
      <div className="degent-card-2">
        <div className="degent-row">
          <h3 className="degent-title h3">
            <span className="icon-square">
              <i className="fas fa-sliders-h text-degent-green text-sm"></i>
            </span>
            Quality Slider
          </h3>
          <span className="text-xl font-bold text-degent-orange">{quality}%</span>
        </div>
        
        <p className="text-degent-muted text-sm mb-3">
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
            className="w-full h-2 bg-degent-input rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #2efc86 0%, #2efc86 ${quality}%, #2a2a2d ${quality}%, #2a2a2d 100%)`,
            }}
          />
          
          <div className="flex justify-between text-xs text-degent-muted mt-1">
            <span>1%</span>
            <span>100%</span>
          </div>
        </div>

        {showCompressing && (
          <div className="mt-3 text-center text-degent-green animate-pulse flex items-center justify-center gap-2">
            <i className="fas fa-spinner fa-spin"></i>
            Compressing...
          </div>
        )}
      </div>

      <div className="degent-card-2 text-sm">
        <div className="degent-row">
          <span className="label-icon">
            <i className="fas fa-file-image text-degent-green"></i>
            Original Size:
          </span>
          <span className="text-white font-semibold">{formatFileSize(originalSize)}</span>
        </div>

        <div className="degent-row">
          <span className="label-icon">
            <i className="fas fa-compress text-degent-green"></i>
            Compressed Size:
          </span>
          <span className={`font-semibold ${isValid ? 'text-degent-green' : 'text-red-400'}`}>
            {formatFileSize(compressedSize)}
          </span>
        </div>

        <div className="degent-row total">
            <span className="text-degent-muted">Valid Range:</span>
            <span className="text-white">200kb - 400kb</span>

        </div>

        <div className={`
         info-text status
          ${isValid ? 'success' : 'error'}
        `}>
          <i className={`fas ${isValid ? 'fa-check-circle' : 'fa-exclamation-triangle'}`}></i>
          {getHelperText()}
        </div>
      </div>

      {compressedFile && (
        <div className="degent-block-border-top">
          <p className="label-icon">
              <i className="fas fa-eye text-degent-green"></i>
            Compressed Image Preview:
          </p>
          <img 
            src={URL.createObjectURL(compressedFile)} 
            alt="Preview" 
            className="degent-image w-full"
          />
        </div>
      )}
    </div>
  );
}
