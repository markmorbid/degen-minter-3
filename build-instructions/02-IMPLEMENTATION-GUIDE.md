# 🔨 Implementation Guide - Degen Minter

**Step-by-step guide to building the application**

---

## 📋 Prerequisites

### Required Software
- Node.js 14+ 
- npm or yarn
- Git
- Code editor (VS Code recommended)

### Required Access
- Skrybit API access (JWT token)
- UniSat wallet (for testing)

### Knowledge Required
- Next.js 14
- TypeScript
- React hooks
- Tailwind CSS
- Bitcoin basics

---

## 🚀 Project Setup

### Step 1: Create Next.js Project

```bash
npx create-next-app@14 degen-minter --typescript --tailwind --app
cd degen-minter
```

### Step 2: Install Dependencies

```bash
npm install axios browser-image-compression form-data
npm install -D @types/node @types/react @types/react-dom
```

### Step 3: Configure Environment Variables

Create `.env` file:
```env
NEXT_PUBLIC_AUTH_TOKEN=your_jwt_token_here
NEXT_PUBLIC_SKRYBIT_API_URL=https://api.skrybit.io
```

Create `.env.local` for local development (optional):
```env
NEXT_PUBLIC_AUTH_TOKEN=your_local_token
```

Add to `.gitignore`:
```
.env
.env.local
```

### Step 4: Configure Tailwind

Update `tailwind.config.js`:
```javascript
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bitcoin: '#F7931A',
      },
    },
  },
  plugins: [],
}
```

---

## 📁 Project Structure

Create this folder structure:

```
degen-minter/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── inscriptions/
│   │   │       └── create-commit/
│   │   │           └── route.ts
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── WalletConnect.tsx
│   │   ├── AIImageInstructions.tsx
│   │   ├── FileUpload.tsx
│   │   ├── QualitySlider.tsx
│   │   ├── FileSizeDisplay.tsx
│   │   ├── MintButton.tsx
│   │   └── StatusDisplay.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   └── wallet.ts
│   └── types/
│       └── index.ts
├── public/
├── .env
├── .gitignore
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

---

## 🔧 Implementation Steps

### Phase 1: Basic Setup & Wallet Connection

#### 1.1 Create Type Definitions

**File**: `src/types/index.ts`

```typescript
export interface InscriptionResponse {
  required_amount_in_sats: string  // Note: returned as string
  payment_address: string
  inscription_id: string  // Don't display to user
}

export interface WalletState {
  address: string | null
  connected: boolean
}
```

#### 1.2 Build WalletConnect Component

**File**: `src/components/WalletConnect.tsx`

Key features:
- UniSat wallet integration
- Mounted state (prevent hydration errors)
- Connect/disconnect functionality

See `04-COMPONENT-SPECS.md` for full implementation.

#### 1.3 Build AIImageInstructions Component

**File**: `src/components/AIImageInstructions.tsx`

Key features:
- Display instructions for generating Degent images
- Requirements: Pepe in tuxedo, bowtie mandatory, text "DEGEN/DEGENT/REGEN"
- Download button for sample image (7.jpg)
- Always visible (not conditional)

**Important**: Place 7.jpg in `/public/` folder for download functionality.

See `04-COMPONENT-SPECS.md` for full implementation.

#### 1.3 Test Wallet Connection

- [ ] Wallet connects successfully
- [ ] Address displays correctly
- [ ] Disconnect works
- [ ] No hydration errors in console

---

### Phase 2: File Upload & Validation

#### 2.1 Build FileUpload Component

**File**: `src/components/FileUpload.tsx`

Key features:
- Accept jpg, png, gif, webp only
- Drag-and-drop support
- File type validation
- Clear error messages

See `04-COMPONENT-SPECS.md` for full implementation.

#### 2.2 Test File Upload

- [ ] Accepts valid image types
- [ ] Rejects invalid file types
- [ ] Drag-and-drop works
- [ ] Click to browse works
- [ ] Error messages display correctly

---

### Phase 3: Quality Slider & Compression

#### 3.1 Build QualitySlider Component

**File**: `src/components/QualitySlider.tsx`

**CRITICAL Implementation Details:**

```typescript
const [quality, setQuality] = useState(100)  // Default 100%
const [isCompressing, setIsCompressing] = useState(false)
const [showCompressing, setShowCompressing] = useState(false)

const compressImage = async (qualityValue: number) => {
  // At 100%, use original file
  if (qualityValue === 100) {
    onCompressionComplete(originalFile, originalFile.size)
    return
  }

  setIsCompressing(true)
  
  // Delayed indicator
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
    
    const compressed = await imageCompression(originalFile, options)
    onCompressionComplete(compressed, compressed.size)
  } finally {
    clearTimeout(showTimeout)
    setIsCompressing(false)
    setShowCompressing(false)
  }
}

const handleSliderRelease = () => {
  compressImage(quality)
}

return (
  <input
    type="range"
    min="10"
    max="100"
    value={quality}
    onChange={(e) => setQuality(Number(e.target.value))}
    onMouseUp={handleSliderRelease}   // Desktop
    onTouchEnd={handleSliderRelease}  // Mobile
  />
)
```

#### 3.2 Test Quality Slider

- [ ] Defaults to 100%
- [ ] At 100%, compressed = original size
- [ ] Slider moves smoothly (no lag)
- [ ] Compression triggers on release
- [ ] "Compressing..." only shows if >200ms
- [ ] Works on mobile (touch)

---

### Phase 4: File Size Display & Validation

#### 4.1 Build FileSizeDisplay Component

**File**: `src/components/FileSizeDisplay.tsx`

Key features:
- Show original and compressed sizes
- Visual indicator (green/red)
- Helper messages
- Format sizes nicely

```typescript
const MIN_SIZE = 200 * 1024  // 200kb
const MAX_SIZE = 400 * 1024  // 400kb

const isValid = compressedSize >= MIN_SIZE && compressedSize <= MAX_SIZE

const formatSize = (bytes: number) => {
  return `${(bytes / 1024).toFixed(0)}kb`
}
```

#### 4.2 Test File Size Display

- [ ] Shows original size correctly
- [ ] Shows compressed size correctly
- [ ] Green indicator when valid
- [ ] Red indicator when invalid
- [ ] Helper messages display correctly

---

### Phase 5: API Integration

#### 5.1 Build API Route

**File**: `src/app/api/inscriptions/create-commit/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import FormData from 'form-data'
import axios from 'axios'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const recipient_address = formData.get('recipient_address') as string
    const fee_rate = formData.get('fee_rate') as string
    const sender_address = formData.get('sender_address') as string

    // Validate file size
    const MIN_SIZE = 200 * 1024
    const MAX_SIZE = 400 * 1024
    
    if (file.size < MIN_SIZE || file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File size must be between 200kb and 400kb' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create form data for Skrybit
    const apiFormData = new FormData()
    apiFormData.append('file', buffer, {
      filename: file.name,
      contentType: file.type,
    })
    apiFormData.append('recipient_address', recipient_address)
    apiFormData.append('fee_rate', fee_rate)
    apiFormData.append('sender_address', sender_address)

    // Get auth token
    const authToken = process.env.NEXT_PUBLIC_AUTH_TOKEN
    if (!authToken) {
      return NextResponse.json(
        { error: 'Authentication token not configured' },
        { status: 500 }
      )
    }

    // Call Skrybit API
    const response = await axios.post(
      'https://api.skrybit.io/inscriptions/create-commit',
      apiFormData,
      {
        headers: {
          ...apiFormData.getHeaders(),
          'Authorization': `Bearer ${authToken}`,
        },
      }
    )

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error('Error creating inscription:', error)
    
    if (error.response) {
      return NextResponse.json(
        { error: error.response.data?.message || 'API request failed' },
        { status: error.response.status }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
```

#### 5.2 Test API Route

- [ ] Accepts valid files
- [ ] Rejects files outside size range
- [ ] Returns required_amount_in_sats
- [ ] Returns payment_address
- [ ] Error handling works

---

### Phase 6: Auto-Calculation Logic

#### 6.1 Implement in Main Page

**File**: `src/app/page.tsx`

```typescript
const [walletAddress, setWalletAddress] = useState('')
const [uploadedFile, setUploadedFile] = useState<File | null>(null)
const [compressedFile, setCompressedFile] = useState<File | null>(null)
const [compressedSize, setCompressedSize] = useState(0)
const [feeRate, setFeeRate] = useState(1)
const [requiredSats, setRequiredSats] = useState<number | null>(null)
const [paymentAddress, setPaymentAddress] = useState('')
const [isCalculating, setIsCalculating] = useState(false)

const MIN_SIZE = 200 * 1024
const MAX_SIZE = 400 * 1024
const isValidSize = compressedSize >= MIN_SIZE && compressedSize <= MAX_SIZE

// Auto-calculate when file becomes valid
useEffect(() => {
  if (walletAddress && compressedFile && isValidSize && !requiredSats) {
    calculateInscription()
  }
}, [walletAddress, compressedFile, isValidSize])

const calculateInscription = async () => {
  if (!walletAddress || !compressedFile || !isValidSize) return

  setIsCalculating(true)
  
  try {
    const formData = new FormData()
    formData.append('file', compressedFile)
    formData.append('recipient_address', walletAddress)
    formData.append('fee_rate', feeRate.toString())
    formData.append('sender_address', walletAddress)

    const response = await fetch('/api/inscriptions/create-commit', {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Calculation failed')
    }

    setRequiredSats(parseInt(data.required_amount_in_sats))
    setPaymentAddress(data.payment_address)
    // Note: inscription_id returned but not stored/displayed
  } catch (error: any) {
    console.error('Calculation error:', error)
    // Handle error
  } finally {
    setIsCalculating(false)
  }
}
```

#### 6.2 Test Auto-Calculation

- [ ] Triggers when file enters valid range
- [ ] Does NOT trigger on wallet connection
- [ ] Shows loading state
- [ ] Displays results correctly
- [ ] Handles errors gracefully

---

### Phase 6.5: Fee Rate Debouncing

#### 6.5.1 Implement Debounced Fee Rate Changes

**Purpose**: Prevent multiple API calls when user changes fee rate quickly

**Implementation**:

```typescript
import { useEffect, useRef, useState } from 'react'

const [feeRate, setFeeRate] = useState(1)
const [isRecalculating, setIsRecalculating] = useState(false)
const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

const handleFeeRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = parseFloat(e.target.value)
  
  if (!isNaN(value) && value >= 0.1) {
    setFeeRate(value)
    
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    
    // Set new timer - recalculate after 500ms of no changes
    debounceTimerRef.current = setTimeout(() => {
      if (walletAddress && compressedFile && isValidSize) {
        recalculateWithNewFeeRate(value)
      }
    }, 500)
  }
}

const recalculateWithNewFeeRate = async (newFeeRate: number) => {
  setIsRecalculating(true)
  
  try {
    const formData = new FormData()
    formData.append('file', compressedFile)
    formData.append('recipient_address', walletAddress)
    formData.append('sender_address', walletAddress)
    formData.append('fee_rate', newFeeRate.toString())
    
    const response = await fetch('/api/inscriptions/create-commit', {
      method: 'POST',
      body: formData,
    })
    
    const data = await response.json()
    
    if (response.ok) {
      setRequiredSats(data.required_amount_in_sats)
      setPaymentAddress(data.payment_address)
    } else {
      console.error('Recalculation failed:', data.error)
    }
  } catch (error) {
    console.error('Error recalculating:', error)
  } finally {
    setIsRecalculating(false)
  }
}

// Cleanup on unmount
useEffect(() => {
  return () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
  }
}, [])
```

**Key Points**:
- Wait 500ms after user stops typing
- Clear previous timer on each change
- Show loading state during recalculation
- Only recalculate if file is valid
- Cleanup timer on component unmount

#### 6.5.2 Test Fee Rate Debouncing

- [ ] Change fee rate quickly - only one API call after 500ms
- [ ] Loading state shows during recalculation
- [ ] Required sats updates with new fee rate
- [ ] No errors in console
- [ ] Works with decimal values (0.1, 0.5, etc.)

---

### Phase 7: Mint Button & Payment

#### 7.1 Build MintButton Component

**File**: `src/components/MintButton.tsx`

**CRITICAL: parseInt() Conversion**

```typescript
const handleMint = async () => {
  if (!requiredSats || !paymentAddress) return

  try {
    // CRITICAL: Convert to integer
    const amountInSats = parseInt(requiredSats.toString())
    
    const txid = await window.unisat.sendBitcoin(
      paymentAddress,
      amountInSats
    )
    
    console.log('Transaction ID:', txid)
    // Show success message
  } catch (error: any) {
    console.error('Payment error:', error)
    // Show error message
  }
}
```

#### 7.2 Test Minting

- [ ] Button enabled only when all conditions met
- [ ] UniSat wallet prompts for payment
- [ ] Payment amount shows correctly (not 0.00000000)
- [ ] Transaction completes successfully
- [ ] Success/error messages display

---

### Phase 8: Status Display & UI Polish

#### 8.1 Build StatusDisplay Component

**File**: `src/components/StatusDisplay.tsx`

Display:
- ✅ Wallet address
- ✅ File sizes
- ✅ Required sats
- ✅ Payment address
- ❌ inscription_id (don't show)

#### 8.2 Polish UI

- [ ] Responsive on all screen sizes
- [ ] Loading states for all async operations
- [ ] Error messages are clear
- [ ] Success feedback
- [ ] Smooth animations
- [ ] Accessible (keyboard navigation, screen readers)

---

## 🧪 Testing Checklist

### File Upload
- [ ] Upload jpg file
- [ ] Upload png file
- [ ] Upload gif file
- [ ] Upload webp file
- [ ] Reject pdf file
- [ ] Reject txt file
- [ ] Drag-and-drop works

### Quality Slider
- [ ] Defaults to 100%
- [ ] At 100%, sizes match
- [ ] Slider moves smoothly
- [ ] Compression on release
- [ ] Works on mobile
- [ ] "Compressing..." indicator works

### Validation
- [ ] Green when 200-400kb
- [ ] Red when <200kb
- [ ] Red when >400kb
- [ ] Helper messages correct

### Auto-Calculation
- [ ] Triggers when valid
- [ ] Doesn't trigger when invalid
- [ ] Shows loading state
- [ ] Displays results
- [ ] Handles errors

### Minting
- [ ] Button states correct
- [ ] UniSat payment works
- [ ] Amount displays correctly
- [ ] Transaction completes
- [ ] Error handling works

### Display
- [ ] All required info shown
- [ ] inscription_id NOT shown
- [ ] Responsive design
- [ ] No console errors
- [ ] No hydration errors

---

## 🧪 Detailed Testing Procedures

### Test 1: Hydration Fix Verification

**Purpose**: Ensure no React hydration errors occur

**Steps**:
1. Open the app in a browser
2. Open browser console (F12)
3. Check for hydration errors in console
4. Verify "Loading..." button appears briefly on initial load
5. Confirm wallet detection message appears correctly after mount
6. Refresh page multiple times to verify consistency

**Expected Results**:
- ✅ No hydration errors in console
- ✅ "Loading..." button shows during SSR
- ✅ Smooth transition to "Connect Wallet" button
- ✅ No layout shift or flashing

---

### Test 2: Fee Rate Changes

**Purpose**: Verify decimal fee rate support

**Steps**:
1. Connect wallet
2. Upload a valid file
3. Try setting fee rate to 0.1 - should work
4. Try setting fee rate to 0.5 - should work
5. Try setting fee rate to 1.5 - should work
6. Try setting fee rate to 10 - should work
7. Use up/down arrows - should increment by 0.1
8. Verify calculation updates with new fee rates

**Expected Results**:
- ✅ Accepts decimal values (0.1, 0.5, etc.)
- ✅ Minimum 0.1 enforced
- ✅ Step increments work correctly
- ✅ Calculation reflects fee rate changes

---

### Test 3: File Upload Validation

**Purpose**: Verify file type validation works correctly

**Steps**:
1. Try uploading a .jpg file - should accept
2. Try uploading a .png file - should accept
3. Try uploading a .gif file - should accept
4. Try uploading a .webp file - should accept
5. Try uploading a .pdf file - should reject with error
6. Try uploading a .txt file - should reject with error
7. Try uploading a .mp4 file - should reject with error
8. Test drag-and-drop with valid file
9. Test drag-and-drop with invalid file

**Expected Results**:
- ✅ Accepts jpg, png, gif, webp
- ✅ Rejects all other file types
- ✅ Clear error messages for invalid types
- ✅ Drag-and-drop works same as click-to-browse

---

### Test 4: Quality Slider Behavior

**Purpose**: Verify quality slider works as specified

**Steps**:
1. Upload a file
2. Verify slider defaults to 100%
3. Verify compressed size = original size at 100%
4. Move slider to 80% and release
5. Wait for compression to complete
6. Verify "Compressing..." only shows if compression takes >200ms
7. Verify compressed size updates
8. Move slider to 50% and release
9. Verify compression happens again
10. Test on mobile device (touch events)

**Expected Results**:
- ✅ Defaults to 100%
- ✅ At 100%, no compression occurs
- ✅ Compression only triggers on release (not during drag)
- ✅ "Compressing..." indicator only shows for slow compressions
- ✅ File size updates after each compression
- ✅ Works on mobile (touch events)

---

### Test 5: File Size Validation

**Purpose**: Verify size validation and visual feedback

**Steps**:
1. Upload a small file (<200kb)
2. Verify red indicator and "too small" message
3. Increase quality slider until file is 200-400kb
4. Verify green indicator and "valid" message
5. Increase quality slider until file is >400kb
6. Verify red indicator and "too large" message
7. Adjust slider to get file back in valid range
8. Verify green indicator returns

**Expected Results**:
- ✅ Red indicator when <200kb
- ✅ Red indicator when >400kb
- ✅ Green indicator when 200-400kb
- ✅ Helper messages are clear and accurate
- ✅ Both original and compressed sizes display

---

### Test 6: Auto-Calculation Trigger

**Purpose**: Verify calculation triggers at correct time

**Steps**:
1. Connect wallet - should NOT trigger calculation
2. Upload file outside valid range - should NOT trigger
3. Adjust slider until file enters 200-400kb range
4. Verify calculation triggers automatically
5. Verify loading state shows during calculation
6. Verify results display correctly
7. Change fee rate - should NOT auto-recalculate
8. Upload new file in valid range - should trigger new calculation

**Expected Results**:
- ✅ Does NOT trigger on wallet connection
- ✅ Does NOT trigger on fee rate change
- ✅ DOES trigger when file enters valid range
- ✅ Shows loading state during calculation
- ✅ Displays required sats and payment address
- ✅ Does NOT display inscription_id

---

### Test 7: Mint Button States

**Purpose**: Verify mint button enables/disables correctly

**Steps**:
1. Start with no wallet connected - button should be disabled
2. Connect wallet - button still disabled (no file)
3. Upload file outside valid range - button still disabled
4. Adjust slider to valid range - wait for calculation
5. After calculation completes - button should enable
6. Verify button shows "Mint for X sats"
7. Disconnect wallet - button should disable
8. Reconnect and verify button re-enables

**Expected Results**:
- ✅ Disabled when wallet not connected
- ✅ Disabled when no file uploaded
- ✅ Disabled when file outside valid range
- ✅ Disabled during calculation
- ✅ Enabled when all conditions met
- ✅ Shows required sats amount
- ✅ Clear disabled reason messages

---

### Test 8: Minting Process

**Purpose**: Verify complete minting flow works

**Steps**:
1. Complete all previous steps to enable mint button
2. Click "Mint" button
3. Verify UniSat wallet popup appears
4. Check payment amount in UniSat (should NOT be 0.00000000)
5. Verify payment address is correct
6. Approve transaction in UniSat
7. Verify transaction ID is returned
8. Verify success message displays
9. Check browser console for any errors

**Expected Results**:
- ✅ UniSat wallet prompts for payment
- ✅ Payment amount displays correctly (not 0.00000000)
- ✅ Payment address matches API response
- ✅ Transaction completes successfully
- ✅ Success message displays
- ✅ No console errors

---

### Test 9: Error Handling

**Purpose**: Verify error handling works correctly

**Steps**:
1. Test with invalid API token - should show error
2. Test with network disconnected - should show error
3. Test rejecting wallet connection - should handle gracefully
4. Test rejecting payment in UniSat - should show error
5. Test uploading corrupted image - should handle gracefully
6. Test with very large file (>10MB) - should handle

**Expected Results**:
- ✅ Clear error messages for all error cases
- ✅ No app crashes
- ✅ User can recover from errors
- ✅ Errors logged to console for debugging

---

### Test 10: Responsive Design

**Purpose**: Verify app works on all screen sizes

**Steps**:
1. Test on mobile (< 768px)
2. Test on tablet (768px - 1024px)
3. Test on desktop (> 1024px)
4. Test portrait and landscape orientations
5. Verify all buttons are touch-friendly on mobile
6. Verify slider works with touch on mobile
7. Verify text is readable on all sizes

**Expected Results**:
- ✅ Responsive layout on all screen sizes
- ✅ Touch-friendly controls on mobile
- ✅ Readable text on all devices
- ✅ No horizontal scrolling
- ✅ Proper spacing and alignment

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Test Production Build

```bash
npm run start
```

### Deploy to Vercel

```bash
vercel deploy
```

Or connect GitHub repo to Vercel for automatic deployments.

### Environment Variables

Set in Vercel dashboard:
- `NEXT_PUBLIC_AUTH_TOKEN`
- `NEXT_PUBLIC_SKRYBIT_API_URL`

---

## 🐛 Common Issues & Solutions

### Issue: "0.00000000 BTC" in UniSat

**Solution**: Use parseInt() conversion
```typescript
const amountInSats = parseInt(requiredSats)
```

### Issue: Hydration Error

**Solution**: Use mounted state in WalletConnect
```typescript
const [mounted, setMounted] = useState(false)
useEffect(() => setMounted(true), [])
if (!mounted) return <div>Loading...</div>
```

### Issue: Compression Flashing

**Solution**: Compress on release, not real-time
```typescript
onMouseUp={handleSliderRelease}
onTouchEnd={handleSliderRelease}
```

### Issue: Unexpected Compression at 100%

**Solution**: Skip compression library at 100%
```typescript
if (quality === 100) {
  return originalFile
}
```

---

## 📚 Next Steps

1. ✅ Complete implementation
2. 🧪 Test thoroughly
3. 🎨 Polish UI/UX
4. 🚀 Deploy to production
5. 📊 Monitor and iterate

---

**Need detailed component code?** See `04-COMPONENT-SPECS.md` →  
**Need API details?** See `03-TECHNICAL-SPECS.md` →  
**Need quick reference?** See `05-QUICK-REFERENCE.md` →
