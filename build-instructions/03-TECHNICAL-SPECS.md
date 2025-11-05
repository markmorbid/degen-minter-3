# 🔧 Technical Specifications - Degen Minter

**Technical architecture, API details, and system design**

---

## 🏗️ System Architecture

### Overview

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Browser   │ ───▶ │  Next.js API │ ───▶ │  Skrybit    │
│  (Frontend) │ ◀─── │   (Proxy)    │ ◀─── │     API     │
└─────────────┘      └──────────────┘      └─────────────┘
       │                                           │
       ▼                                           ▼
┌─────────────┐                            ┌─────────────┐
│   UniSat    │                            │  Bitcoin    │
│   Wallet    │                            │ Blockchain  │
└─────────────┘                            └─────────────┘
```

### Data Flow

1. **User uploads file** → Frontend validates type
2. **User adjusts quality** → Frontend compresses image
3. **File enters valid range** → Frontend calls Next.js API
4. **Next.js API** → Proxies request to Skrybit API
5. **Skrybit API** → Calculates required sats, returns payment details
6. **Frontend** → Displays payment info to user
7. **User clicks mint** → UniSat wallet prompts for payment
8. **User pays** → Bitcoin transaction on blockchain
9. **Skrybit** → Creates inscription, sends to user's wallet

---

## 📦 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.5+
- **UI Library**: React 18.3+
- **Styling**: Tailwind CSS 3.4+
- **HTTP Client**: Axios 1.7+
- **Image Compression**: browser-image-compression 2.0+

### Backend (Next.js API Routes)
- **Runtime**: Node.js 20+
- **Framework**: Next.js API Routes
- **HTTP Client**: Axios
- **Form Handling**: form-data

### External Services
- **Blockchain**: Bitcoin
- **Wallet**: UniSat Wallet (browser extension)
- **Inscription API**: Skrybit API
- **Authentication**: JWT (Bearer token)

---

## 🔌 API Integration

### Skrybit API

#### Base URL
```
https://api.skrybit.io
```

#### Authentication
```
Authorization: Bearer {JWT_TOKEN}
```

#### Endpoint: Create Inscription Commit

**URL**: `POST /inscriptions/create-commit`

**Content-Type**: `multipart/form-data`

**Request Parameters**:
```typescript
{
  file: File                    // Image file (200kb-400kb)
  recipient_address: string     // Bitcoin address (user's wallet)
  fee_rate: string              // Fee rate in sats/vB (e.g., "1")
  sender_address: string        // Bitcoin address (same as recipient)
}
```

**Response** (200 OK):
```typescript
{
  required_amount_in_sats: string    // Total sats needed (as STRING)
  payment_address: string            // Where to send payment
  inscription_id: string             // For tracking (don't display to user)
}
```

**Error Responses**:
- `400` - Invalid request (bad file, missing params)
- `401` - Unauthorized (invalid/missing JWT)
- `500` - Server error

---

## 🛣️ Next.js API Routes

### Route: `/api/inscriptions/create-commit`

**Purpose**: Proxy requests to Skrybit API with server-side authentication

**Method**: POST

**Implementation**:

```typescript
// src/app/api/inscriptions/create-commit/route.ts

import { NextRequest, NextResponse } from 'next/server'
import FormData from 'form-data'
import axios from 'axios'

export async function POST(request: NextRequest) {
  try {
    // 1. Parse incoming form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const recipient_address = formData.get('recipient_address') as string
    const fee_rate = formData.get('fee_rate') as string
    const sender_address = formData.get('sender_address') as string

    // 2. Validate required fields
    if (!file || !recipient_address || !fee_rate || !sender_address) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // 3. Validate file size (server-side validation)
    const MIN_SIZE = 200 * 1024  // 200kb
    const MAX_SIZE = 400 * 1024  // 400kb
    
    if (file.size < MIN_SIZE || file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `File size must be between 200kb and 400kb. Current: ${Math.round(file.size / 1024)}kb` },
        { status: 400 }
      )
    }

    // 4. Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // 5. Create form data for Skrybit API
    const apiFormData = new FormData()
    apiFormData.append('file', buffer, {
      filename: file.name,
      contentType: file.type,
    })
    apiFormData.append('recipient_address', recipient_address)
    apiFormData.append('fee_rate', fee_rate)
    apiFormData.append('sender_address', sender_address)

    // 6. Get JWT token from environment (server-side only)
    const authToken = process.env.NEXT_PUBLIC_AUTH_TOKEN
    if (!authToken) {
      return NextResponse.json(
        { error: 'Authentication token not configured' },
        { status: 500 }
      )
    }

    // 7. Call Skrybit API
    const response = await axios.post(
      'https://api.skrybit.io/inscriptions/create-commit',
      apiFormData,
      {
        headers: {
          ...apiFormData.getHeaders(),
          'Authorization': `Bearer ${authToken}`,
        },
        timeout: 30000,  // 30 second timeout
      }
    )

    // 8. Return response to frontend
    return NextResponse.json(response.data)

  } catch (error: any) {
    console.error('Error creating inscription:', error)
    
    // Handle Axios errors
    if (error.response) {
      return NextResponse.json(
        { 
          error: error.response.data?.message || error.response.data?.error || 'API request failed',
          details: error.response.data 
        },
        { status: error.response.status }
      )
    }

    // Handle network/timeout errors
    if (error.code === 'ECONNABORTED') {
      return NextResponse.json(
        { error: 'Request timeout. Please try again.' },
        { status: 504 }
      )
    }

    // Handle other errors
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
```

**Key Points**:
- Server-side file size validation
- JWT token handled server-side (never exposed to client)
- Proper error handling with detailed messages
- Timeout handling (30 seconds)
- Buffer conversion for file upload

---

## 🔐 Security Architecture

### Environment Variables

**File**: `.env`
```env
NEXT_PUBLIC_AUTH_TOKEN=your_jwt_token_here
NEXT_PUBLIC_SKRYBIT_API_URL=https://api.skrybit.io
```

**Security Rules**:
- ✅ Store in `.env` file
- ✅ Add `.env` to `.gitignore`
- ✅ Use only in server-side code (API routes)
- ❌ Never expose to client-side
- ❌ Never commit to version control

### Authentication Flow

```
Frontend Request
      ↓
Next.js API Route (reads JWT from .env)
      ↓
Skrybit API (validates JWT)
      ↓
Response
```

### File Validation

**Client-Side**:
- File type validation
- File size validation
- Enable/disable UI based on validation

**Server-Side**:
- Re-validate file type
- Re-validate file size
- Reject invalid requests

**Why Both?**
- Client-side: Better UX (immediate feedback)
- Server-side: Security (can't trust client)

---

## 💾 State Management

### Frontend State

```typescript
// Main page state
const [walletAddress, setWalletAddress] = useState<string>('')
const [uploadedFile, setUploadedFile] = useState<File | null>(null)
const [compressedFile, setCompressedFile] = useState<File | null>(null)
const [originalSize, setOriginalSize] = useState<number>(0)
const [compressedSize, setCompressedSize] = useState<number>(0)
const [quality, setQuality] = useState<number>(100)
const [feeRate, setFeeRate] = useState<number>(1)
const [requiredSats, setRequiredSats] = useState<number | null>(null)
const [paymentAddress, setPaymentAddress] = useState<string>('')
const [isCalculating, setIsCalculating] = useState<boolean>(false)
const [error, setError] = useState<string>('')
const [status, setStatus] = useState<string>('')
```

### State Flow

```
1. User connects wallet
   → setWalletAddress(address)

2. User uploads file
   → setUploadedFile(file)
   → setOriginalSize(file.size)
   → setCompressedFile(file)  // Initially same as uploaded
   → setCompressedSize(file.size)

3. User adjusts quality slider
   → setQuality(value)
   → (on release) compress image
   → setCompressedFile(compressed)
   → setCompressedSize(compressed.size)

4. File enters valid range
   → Auto-trigger calculation
   → setIsCalculating(true)
   → Call API
   → setRequiredSats(response.required_amount_in_sats)
   → setPaymentAddress(response.payment_address)
   → setIsCalculating(false)

5. User clicks mint
   → Call UniSat wallet
   → Transaction completes
```

---

## 🎨 Component Architecture

### Component Hierarchy

```
App (page.tsx)
├── WalletConnect
│   └── Button (Connect/Disconnect)
├── FileUpload
│   └── Drop Zone / File Input
├── QualitySlider
│   ├── Range Input
│   └── Compression Indicator
├── FileSizeDisplay
│   ├── Original Size
│   ├── Compressed Size
│   └── Validation Indicator
├── StatusDisplay
│   ├── Wallet Info
│   ├── File Info
│   ├── Payment Info
│   └── Error Messages
├── MintButton
│   └── Button (Conditional)
└── ImagePreview
    └── Compressed Image
```

### Data Flow Between Components

```
page.tsx (parent)
    ↓ props
WalletConnect → onConnect(address) → page.tsx
    ↓ props
FileUpload → onFileSelect(file) → page.tsx
    ↓ props
QualitySlider → onCompressionComplete(file, size) → page.tsx
    ↓ props
FileSizeDisplay ← originalSize, compressedSize, isValid
    ↓ props
MintButton → onClick() → page.tsx → UniSat Wallet
    ↓ props
StatusDisplay ← all state for display
```

---

## 🔄 Critical Implementation Details

### 1. parseInt() Conversion for UniSat

**Problem**: Skrybit API returns `required_amount_in_sats` as a string

**Solution**: Convert to integer before passing to UniSat

```typescript
// ❌ WRONG - Will show "0.00000000 BTC" error
await window.unisat.sendBitcoin(paymentAddress, requiredSats)

// ✅ CORRECT - Converts string to integer
const amountInSats = parseInt(requiredSats)
await window.unisat.sendBitcoin(paymentAddress, amountInSats)
```

### 2. Quality Slider at 100%

**Problem**: Compression library still processes image at 100% quality

**Solution**: Skip compression entirely at 100%

```typescript
if (quality === 100) {
  // Use original file, no processing
  onCompressionComplete(originalFile, originalFile.size)
  return
}

// Only compress if quality < 100%
const compressed = await imageCompression(originalFile, options)
onCompressionComplete(compressed, compressed.size)
```

### 3. Compress on Release

**Problem**: Real-time compression causes flashing UI

**Solution**: Only compress when user releases slider

```typescript
// ❌ WRONG - Compresses during drag
onChange={(e) => compressImage(e.target.value)}

// ✅ CORRECT - Compresses on release
onChange={(e) => setQuality(e.target.value)}  // Just update value
onMouseUp={() => compressImage(quality)}      // Compress on release
onTouchEnd={() => compressImage(quality)}     // Mobile support
```

### 4. Delayed Compression Indicator

**Problem**: "Compressing..." flashes even for fast compressions

**Solution**: Only show indicator if compression takes >200ms

```typescript
const showTimeout = setTimeout(() => {
  setShowCompressing(true)
}, 200)

// Compress image...

clearTimeout(showTimeout)
setShowCompressing(false)
```

---

## 📊 Performance Considerations

### Image Compression
- Use web workers (don't block UI)
- Skip compression at 100% quality
- Compress only on user action (not real-time)

### File Handling
- Clean up object URLs to prevent memory leaks
- Efficient file reading with FileReader
- No unnecessary re-compressions

### API Calls
- Single calculation per valid file
- Proper timeout handling (30s)
- Error retry logic (optional)

---

## 🧪 Testing Strategy

### Unit Tests
- File validation functions
- Size formatting functions
- State management logic

### Integration Tests
- API route functionality
- File upload flow
- Compression workflow

### E2E Tests
- Complete user flow
- Wallet integration
- Payment process

---

## 📝 Type Definitions

```typescript
// src/types/index.ts

export interface InscriptionResponse {
  required_amount_in_sats: string
  payment_address: string
  inscription_id: string
}

export interface WalletState {
  address: string | null
  connected: boolean
}

export interface FileState {
  original: File | null
  compressed: File | null
  originalSize: number
  compressedSize: number
  quality: number
}

export interface CalculationState {
  requiredSats: number | null
  paymentAddress: string
  isCalculating: boolean
  error: string | null
}
```

---

**Next**: See `04-COMPONENT-SPECS.md` for detailed component implementations →
