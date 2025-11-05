# 🧩 Component Specifications - Degen Minter

**Detailed specifications for all React components**

---

## 📋 Component Overview

### Required Components
1. **WalletConnect** - UniSat wallet integration
2. **AIImageInstructions** - Instructions for generating Degent images
3. **FileUpload** - File upload with drag-and-drop
4. **QualitySlider** - Image compression slider
5. **FileSizeDisplay** - File size validation display
6. **MintButton** - Conditional mint button
7. **StatusDisplay** - Status and payment information

---

## 1. WalletConnect Component

### Purpose
Handle UniSat wallet connection and display wallet status.

### Props
```typescript
interface WalletConnectProps {
  onConnect: (address: string) => void
  onDisconnect: () => void
  connectedAddress: string | null
}
```

### Implementation

```typescript
'use client'

import { useState, useEffect } from 'react'

export default function WalletConnect({
  onConnect,
  onDisconnect,
  connectedAddress,
}: WalletConnectProps) {
  const [mounted, setMounted] = useState(false)

  // Prevent hydration errors
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleConnect = async () => {
    try {
      if (typeof window.unisat === 'undefined') {
        alert('Please install UniSat Wallet extension')
        return
      }

      const accounts = await window.unisat.requestAccounts()
      if (accounts.length > 0) {
        onConnect(accounts[0])
      }
    } catch (error) {
      console.error('Wallet connection error:', error)
      alert('Failed to connect wallet')
    }
  }

  const handleDisconnect = () => {
    onDisconnect()
  }

  // Show loading state during SSR
  if (!mounted) {
    return (
      <button disabled className="...">
        Loading...
      </button>
    )
  }

  return (
    <div className="space-y-4">
      {!connectedAddress ? (
        <button
          onClick={handleConnect}
          className="w-full py-3 px-6 rounded-lg bg-bitcoin hover:bg-orange-600 text-white font-semibold transition-colors"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="space-y-2">
          <div className="p-4 bg-white/10 rounded-lg">
            <p className="text-sm text-gray-400">Connected Wallet</p>
            <p className="text-white font-mono text-sm break-all">
              {connectedAddress}
            </p>
          </div>
          <button
            onClick={handleDisconnect}
            className="w-full py-2 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  )
}
```

### Key Features
- ✅ Prevents hydration errors with mounted state
- ✅ Checks for UniSat wallet installation
- ✅ Clear connect/disconnect UI
- ✅ Displays connected address

---

## 2. AIImageInstructions Component

### Purpose
Provide users with clear instructions on how to generate their own "Degent" image using AI tools.

### Props
```typescript
interface AIImageInstructionsProps {
  // No props needed - static content
}
```

### Implementation

```typescript
'use client'

export default function AIImageInstructions() {
  const handleDownloadSample = () => {
    // Create download link for 7.jpg from public folder
    const link = document.createElement('a')
    link.href = '/7.jpg'
    link.download = '7.jpg'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        🎨 Create Your Degent Image
      </h2>
      
      <div className="space-y-4 text-gray-700 dark:text-gray-300">
        <div>
          <h3 className="font-semibold mb-2">📋 Image Requirements:</h3>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Must be Pepe in a tuxedo</li>
            <li>Bowtie is <strong>mandatory</strong></li>
            <li>Must include text: "DEGEN", "DEGENT", or "REGEN"</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">🤖 How to Generate:</h3>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>Use any AI image generator (ChatGPT, Midjourney, etc.)</li>
            <li>Download our sample image below as reference</li>
            <li>Upload it to the AI tool and say "Make one like this"</li>
          </ol>
        </div>

        <div>
          <h3 className="font-semibold mb-2">📸 Sample Image:</h3>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <img 
              src="/7.jpg" 
              alt="Sample Degent - Pepe in Tuxedo" 
              className="w-48 h-48 object-cover rounded-lg border-2 border-blue-300 shadow-md"
            />
            <button
              onClick={handleDownloadSample}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Sample (7.jpg)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
```

### Styling Notes
- **Background**: Light blue tint (info box style)
- **Border**: Subtle blue border
- **Typography**: Clear hierarchy with bold headings
- **Button**: Secondary style (blue, not orange like Mint)
- **Icons**: Use emoji or SVG icons
- **Dark mode**: Support dark theme variants

### Behavior
- **Always visible**: Not conditional on any state
- **Download button**: Triggers direct download of 7.jpg
- **Responsive**: Stacks nicely on mobile

### File Requirements
- **7.jpg location**: Must be in `/public/7.jpg`
- **File size**: Sample image (reference only)
- **Download**: Direct download, no API call needed

---

## 3. FileUpload Component

### Purpose
Allow users to upload image files with drag-and-drop support.

### Props
```typescript
interface FileUploadProps {
  onFileSelect: (file: File) => void
  acceptedTypes: string[]  // ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  disabled?: boolean
}
```

### Implementation

```typescript
'use client'

import { useState, useRef } from 'react'

export default function FileUpload({
  onFileSelect,
  acceptedTypes,
  disabled = false,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      setError('Only jpg, png, gif, and webp files are accepted')
      return false
    }

    setError('')
    return true
  }

  const handleFile = (file: File) => {
    if (validateFile(file)) {
      onFileSelect(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (disabled) return

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  return (
    <div className="space-y-2">
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors
          ${isDragging ? 'border-bitcoin bg-bitcoin/10' : 'border-gray-600 hover:border-gray-500'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
        />
        <div className="space-y-2">
          <div className="text-4xl">📁</div>
          <p className="text-white font-semibold">
            Click or drag to upload
          </p>
          <p className="text-sm text-gray-400">
            Accepts: JPG, PNG, GIF, WebP
          </p>
        </div>
      </div>
      
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  )
}
```

### Key Features
- ✅ Drag-and-drop support
- ✅ Click to browse
- ✅ File type validation
- ✅ Clear error messages
- ✅ Disabled state support

---

## 3. QualitySlider Component

### Purpose
Allow users to adjust image quality/compression.

### Props
```typescript
interface QualitySliderProps {
  originalFile: File
  quality: number
  onQualityChange: (quality: number) => void
  onCompressionComplete: (compressedFile: File, size: number) => void
}
```

### Implementation

```typescript
'use client'

import { useState } from 'react'
import imageCompression from 'browser-image-compression'

export default function QualitySlider({
  originalFile,
  quality,
  onQualityChange,
  onCompressionComplete,
}: QualitySliderProps) {
  const [isCompressing, setIsCompressing] = useState(false)
  const [showCompressing, setShowCompressing] = useState(false)

  const compressImage = async (qualityValue: number) => {
    // CRITICAL: At 100%, use original file
    if (qualityValue === 100) {
      onCompressionComplete(originalFile, originalFile.size)
      return
    }

    setIsCompressing(true)

    // Delayed indicator (only show if >200ms)
    const showTimeout = setTimeout(() => {
      setShowCompressing(true)
    }, 200)

    try {
      const options = {
        maxSizeMB: 10,
        maxWidthOrHeight: 4096,
        useWebWorker: true,
        initialQuality: qualityValue / 100,
      }

      const compressedFile = await imageCompression(originalFile, options)
      onCompressionComplete(compressedFile, compressedFile.size)
    } catch (error) {
      console.error('Compression error:', error)
      alert('Failed to compress image')
    } finally {
      clearTimeout(showTimeout)
      setIsCompressing(false)
      setShowCompressing(false)
    }
  }

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    onQualityChange(value)
  }

  const handleSliderRelease = () => {
    compressImage(quality)
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-white font-medium">
          Quality: {quality}%
        </label>
        {showCompressing && (
          <span className="text-sm text-gray-400">Compressing...</span>
        )}
      </div>

      <div className="relative">
        <input
          type="range"
          min="10"
          max="100"
          step="1"
          value={quality}
          onChange={handleSliderChange}
          onMouseUp={handleSliderRelease}
          onTouchEnd={handleSliderRelease}
          disabled={isCompressing}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Low Quality</span>
          <span>High Quality</span>
        </div>
      </div>
    </div>
  )
}
```

### Key Features
- ✅ Defaults to 100% quality
- ✅ Skips compression at 100%
- ✅ Compresses on release (not during drag)
- ✅ Delayed compression indicator
- ✅ Web workers for performance

---

## 4. FileSizeDisplay Component

### Purpose
Display file sizes and validation status.

### Props
```typescript
interface FileSizeDisplayProps {
  originalSize: number
  compressedSize: number
  isValid: boolean
}
```

### Implementation

```typescript
'use client'

const MIN_SIZE = 200 * 1024  // 200kb
const MAX_SIZE = 400 * 1024  // 400kb

export default function FileSizeDisplay({
  originalSize,
  compressedSize,
  isValid,
}: FileSizeDisplayProps) {
  const formatSize = (bytes: number): string => {
    return `${(bytes / 1024).toFixed(0)}kb`
  }

  const getHelperMessage = (): string => {
    if (compressedSize < MIN_SIZE) {
      return 'File too small. Increase quality slider.'
    }
    if (compressedSize > MAX_SIZE) {
      return 'File too large. Decrease quality slider.'
    }
    return 'File size is valid! Ready to mint.'
  }

  return (
    <div className={`
      p-4 rounded-lg border-2 transition-colors
      ${isValid ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'}
    `}>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Original Size:</span>
          <span className="text-white font-semibold">{formatSize(originalSize)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Compressed Size:</span>
          <span className={`font-semibold ${isValid ? 'text-green-400' : 'text-red-400'}`}>
            {formatSize(compressedSize)}
            {isValid ? ' ✓' : ' ✗'}
          </span>
        </div>

        <div className="pt-2 border-t border-gray-700">
          <p className="text-xs text-gray-400">
            Valid range: 200kb - 400kb
          </p>
          <p className={`text-sm mt-1 ${isValid ? 'text-green-400' : 'text-red-400'}`}>
            {getHelperMessage()}
          </p>
        </div>
      </div>
    </div>
  )
}
```

### Key Features
- ✅ Shows original and compressed sizes
- ✅ Visual validation (green/red)
- ✅ Helper messages
- ✅ Clear formatting

---

## 5. MintButton Component

### Purpose
Trigger minting process with proper validation.

### Props
```typescript
interface MintButtonProps {
  onClick: () => void
  disabled: boolean
  disabledReason?: string
  requiredSats: number | null
}
```

### Implementation

```typescript
'use client'

export default function MintButton({
  onClick,
  disabled,
  disabledReason,
  requiredSats,
}: MintButtonProps) {
  return (
    <div className="space-y-2">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          w-full py-4 px-6 rounded-lg font-bold text-lg transition-all
          ${disabled
            ? 'bg-gray-600 cursor-not-allowed text-gray-400'
            : 'bg-gradient-to-r from-bitcoin to-orange-600 hover:from-orange-600 hover:to-bitcoin text-white transform hover:scale-105'
          }
        `}
      >
        {requiredSats
          ? `Mint for ${requiredSats.toLocaleString()} sats`
          : 'Mint Inscription'
        }
      </button>

      {disabled && disabledReason && (
        <p className="text-sm text-gray-400 text-center">
          {disabledReason}
        </p>
      )}
    </div>
  )
}
```

### Key Features
- ✅ Conditional enable/disable
- ✅ Clear disabled reasons
- ✅ Displays required sats
- ✅ Visual feedback

---

## 6. StatusDisplay Component

### Purpose
Display all status and payment information.

### Props
```typescript
interface StatusDisplayProps {
  walletAddress: string
  originalSize: number
  compressedSize: number
  requiredSats: number | null
  paymentAddress: string
  status: string
  error: string
  isCalculating: boolean
}
```

### Implementation

```typescript
'use client'

export default function StatusDisplay({
  walletAddress,
  originalSize,
  compressedSize,
  requiredSats,
  paymentAddress,
  status,
  error,
  isCalculating,
}: StatusDisplayProps) {
  const formatSize = (bytes: number) => `${(bytes / 1024).toFixed(0)}kb`

  return (
    <div className="space-y-4">
      {/* Status Message */}
      {status && (
        <div className="p-4 bg-blue-500/10 border border-blue-500 rounded-lg">
          <p className="text-blue-400">{status}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Calculation Results */}
      {requiredSats && paymentAddress && (
        <div className="p-4 bg-white/5 rounded-lg space-y-3">
          <h3 className="text-white font-semibold">Payment Details</h3>
          
          <div className="space-y-2">
            <div>
              <p className="text-sm text-gray-400">Required Sats</p>
              <p className="text-white font-mono text-lg">
                {requiredSats.toLocaleString()} sats
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-400">Payment Address</p>
              <p className="text-white font-mono text-sm break-all">
                {paymentAddress}
              </p>
            </div>
          </div>

          <p className="text-xs text-gray-500">
            Note: inscription_id is not displayed per requirements
          </p>
        </div>
      )}

      {/* Calculating State */}
      {isCalculating && (
        <div className="p-4 bg-white/5 rounded-lg">
          <p className="text-gray-400">Calculating required sats...</p>
        </div>
      )}
    </div>
  )
}
```

### Key Features
- ✅ Shows all required information
- ✅ Does NOT show inscription_id
- ✅ Clear status messages
- ✅ Error handling

---

## 📋 Error Messages Reference

### FileUpload Component Errors

```typescript
const ERROR_MESSAGES = {
  INVALID_FILE_TYPE: 'Only image files (jpg, png, gif, webp) are accepted',
  NO_FILE_SELECTED: 'Please upload an image file',
  FILE_TOO_LARGE_INITIAL: 'File is too large to process. Please select a smaller file.',
}
```

**Usage**:
```typescript
if (!acceptedTypes.includes(file.type)) {
  setError(ERROR_MESSAGES.INVALID_FILE_TYPE)
  return false
}
```

---

### FileSizeDisplay Component Messages

```typescript
const SIZE_MESSAGES = {
  TOO_SMALL: 'File is too small. Minimum size is 200kb. Increase quality slider.',
  TOO_LARGE: 'File is too large. Maximum size is 400kb. Decrease quality slider.',
  VALID: 'File size is valid! Ready to mint.',
  CALCULATING: 'Calculating required sats...',
}
```

**Usage**:
```typescript
const getHelperMessage = (): string => {
  if (compressedSize < MIN_SIZE) return SIZE_MESSAGES.TOO_SMALL
  if (compressedSize > MAX_SIZE) return SIZE_MESSAGES.TOO_LARGE
  return SIZE_MESSAGES.VALID
}
```

---

### QualitySlider Component Errors

```typescript
const COMPRESSION_ERRORS = {
  FAILED: 'Failed to compress image. Please try a different file.',
  CORRUPTED: 'Image file appears to be corrupted. Please try another file.',
  UNSUPPORTED: 'Image format not supported for compression.',
}
```

**Usage**:
```typescript
try {
  const compressed = await imageCompression(originalFile, options)
  onCompressionComplete(compressed, compressed.size)
} catch (error) {
  console.error('Compression error:', error)
  alert(COMPRESSION_ERRORS.FAILED)
}
```

---

### WalletConnect Component Errors

```typescript
const WALLET_ERRORS = {
  NOT_INSTALLED: 'UniSat wallet not detected. Please install the UniSat browser extension.',
  CONNECTION_FAILED: 'Failed to connect wallet. Please try again.',
  USER_REJECTED: 'Wallet connection rejected by user.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
}
```

**Usage**:
```typescript
try {
  if (typeof window.unisat === 'undefined') {
    alert(WALLET_ERRORS.NOT_INSTALLED)
    return
  }
  const accounts = await window.unisat.requestAccounts()
  // ...
} catch (error) {
  console.error('Wallet connection error:', error)
  alert(WALLET_ERRORS.CONNECTION_FAILED)
}
```

---

### MintButton Component Errors

```typescript
const MINT_ERRORS = {
  NO_WALLET: 'Connect wallet to continue',
  NO_FILE: 'Upload a file to continue',
  FILE_TOO_SMALL: 'File too small (min: 200kb)',
  FILE_TOO_LARGE: 'File too large (max: 400kb)',
  CALCULATING: 'Calculating...',
  CALCULATION_FAILED: 'Calculation failed. Try again.',
  PAYMENT_FAILED: 'Failed to send payment. Please try again.',
  FEE_TOO_LOW: 'Failed to send payment. Fee rate may be too low.',
  UNISAT_ERROR: 'Error adding output',
  AMOUNT_ZERO: '0.00000000 BTC', // Caused by not using parseInt()
}
```

**Disabled Reason Logic**:
```typescript
const getDisabledReason = (): string => {
  if (!walletAddress) return MINT_ERRORS.NO_WALLET
  if (!compressedFile) return MINT_ERRORS.NO_FILE
  if (compressedSize < MIN_SIZE) return MINT_ERRORS.FILE_TOO_SMALL
  if (compressedSize > MAX_SIZE) return MINT_ERRORS.FILE_TOO_LARGE
  if (isCalculating) return MINT_ERRORS.CALCULATING
  if (!requiredSats) return MINT_ERRORS.CALCULATION_FAILED
  return ''
}
```

---

### StatusDisplay Component Messages

```typescript
const STATUS_MESSAGES = {
  CONNECTING: 'Connecting to wallet...',
  UPLOADING: 'Processing file...',
  COMPRESSING: 'Compressing image...',
  CALCULATING: 'Calculating required sats...',
  READY: 'Ready to mint!',
  MINTING: 'Processing payment...',
  SUCCESS: 'Payment sent! Transaction ID: ',
  ERROR: 'An error occurred. Please try again.',
}
```

**API Error Messages**:
```typescript
const API_ERRORS = {
  MISSING_DATA: 'Inscription data not available. Please try again.',
  API_ERROR: 'Failed to calculate inscription cost. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  INVALID_RESPONSE: 'Invalid response from server. Please try again.',
  AUTH_ERROR: 'Authentication failed. Please check your API token.',
  FILE_SIZE_ERROR: 'File size must be between 200kb and 400kb',
}
```

---

### Common Error Handling Pattern

```typescript
// Consistent error handling across components
const handleError = (error: any, context: string) => {
  console.error(`Error in ${context}:`, error)
  
  // User-friendly error message
  let userMessage = 'An error occurred. Please try again.'
  
  if (error.response) {
    // API error
    userMessage = error.response.data?.error || error.response.data?.message || userMessage
  } else if (error.message) {
    // JavaScript error
    userMessage = error.message
  }
  
  // Display to user (toast, alert, or state)
  setError(userMessage)
}
```

**Usage Example**:
```typescript
try {
  const response = await fetch('/api/inscriptions/create-commit', {...})
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'API request failed')
  }
  
  // Success handling
} catch (error) {
  handleError(error, 'calculateInscription')
}
```

---

## 🎨 UI Feedback Best Practices

### Loading States
- Show spinner or skeleton for async operations
- Disable buttons during processing
- Show progress indicators for long operations
- Use "Compressing...", "Calculating...", etc.

### Success States
- Green checkmark or success icon
- Clear success message
- Auto-dismiss after 3-5 seconds (optional)
- Show transaction ID for minting success

### Error States
- Red error icon or border
- Clear, actionable error message
- Suggest next steps when possible
- Allow user to retry
- Don't auto-dismiss (user must acknowledge)

### Validation Feedback
- Real-time validation (as user types/interacts)
- Green border/checkmark for valid
- Red border/X for invalid
- Helper text below input
- Disable submit until valid

---

**Next**: See `05-QUICK-REFERENCE.md` for quick lookup during development →
