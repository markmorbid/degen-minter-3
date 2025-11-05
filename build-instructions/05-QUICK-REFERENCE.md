# ⚡ Quick Reference - Degen Minter

**Quick lookup for common tasks and code snippets**

---

## 🎯 Core Requirements

### File Upload
- **Types**: jpg, png, gif, webp
- **Size**: 200kb - 400kb
- **Method**: Click or drag-and-drop

### Quality Slider
- **Range**: 10% - 100%
- **Default**: 100%
- **Trigger**: On release (onMouseUp/onTouchEnd)

### Validation
- **Min**: 200kb (204,800 bytes)
- **Max**: 400kb (409,600 bytes)
- **Display**: Green (valid) / Red (invalid)

### Fee Rate
- **Default**: 1 sats/vB
- **Minimum**: 0.1 sats/vB
- **Step**: 0.1 increments
- **Input**: Number field with decimal support

### Mint Button
**Enabled when:**
- ✅ Wallet connected
- ✅ File uploaded
- ✅ File is 200kb-400kb
- ✅ Calculation complete

---

## 🔑 Critical Code Snippets

### parseInt() for UniSat
```typescript
// CRITICAL: Convert to integer
const amountInSats = parseInt(requiredSats)
await window.unisat.sendBitcoin(paymentAddress, amountInSats)
```

### Skip Compression at 100%
```typescript
if (quality === 100) {
  onCompressionComplete(originalFile, originalFile.size)
  return
}
// Compress only if < 100%
```

### Compress on Release
```typescript
<input
  type="range"
  onChange={(e) => setQuality(Number(e.target.value))}
  onMouseUp={handleSliderRelease}
  onTouchEnd={handleSliderRelease}
/>
```

### File Size Validation
```typescript
const MIN_SIZE = 200 * 1024
const MAX_SIZE = 400 * 1024
const isValid = size >= MIN_SIZE && size <= MAX_SIZE
```

### Fee Rate Input with Debouncing
```typescript
// Use parseFloat for decimal support + debouncing
const [feeRate, setFeeRate] = useState(1)
const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

const handleFeeRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = parseFloat(e.target.value)
  
  if (!isNaN(value) && value >= 0.1) {
    setFeeRate(value)
    
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    
    // Recalculate after 500ms of no changes
    debounceTimerRef.current = setTimeout(() => {
      recalculateWithNewFeeRate(value)
    }, 500)
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

<input
  type="number"
  min="0.1"
  step="0.1"
  value={feeRate}
  onChange={handleFeeRateChange}
/>
```

---

## 📦 Dependencies

```json
{
  "dependencies": {
    "next": "14.2.5",
    "react": "^18.3.1",
    "axios": "^1.7.2",
    "browser-image-compression": "^2.0.2",
    "form-data": "^4.0.0"
  }
}
```

---

## 🔧 Environment Variables

```env
NEXT_PUBLIC_AUTH_TOKEN=your_jwt_token_here
NEXT_PUBLIC_SKRYBIT_API_URL=https://api.skrybit.io
```

---

## 🎨 State Management

```typescript
const [walletAddress, setWalletAddress] = useState('')
const [uploadedFile, setUploadedFile] = useState<File | null>(null)
const [compressedFile, setCompressedFile] = useState<File | null>(null)
const [quality, setQuality] = useState(100)
const [originalSize, setOriginalSize] = useState(0)
const [compressedSize, setCompressedSize] = useState(0)
const [feeRate, setFeeRate] = useState(1) // Default 1 sats/vB, min 0.1
const [requiredSats, setRequiredSats] = useState<number | null>(null)
const [paymentAddress, setPaymentAddress] = useState('')
```

---

## 🔄 User Flow

```
1. Connect Wallet
2. Upload Image
3. View Original Size (100% quality)
4. Adjust Quality Slider
5. Release Slider → Compression
6. If 200-400kb → Auto-Calculate
7. Review Payment Details
8. Click Mint
9. UniSat Payment
10. Done
```

---

## 🚨 Common Issues

### "0.00000000 BTC" Error
**Fix**: Use parseInt()
```typescript
const amountInSats = parseInt(requiredSats)
```

### Hydration Error
**Fix**: Use mounted state
```typescript
const [mounted, setMounted] = useState(false)
useEffect(() => setMounted(true), [])
if (!mounted) return <div>Loading...</div>
```

### Flashing Compression
**Fix**: Compress on release
```typescript
onMouseUp={handleSliderRelease}
```

---

## 📊 Display Rules

### Show
- ✅ Wallet address
- ✅ Original size
- ✅ Compressed size
- ✅ Required sats
- ✅ Payment address

### Hide
- ❌ inscription_id

---

## 🧪 Testing Checklist

- [ ] Upload jpg, png, gif, webp
- [ ] Reject other file types
- [ ] Slider defaults to 100%
- [ ] At 100%, sizes match
- [ ] Compress on release
- [ ] Green when 200-400kb
- [ ] Red when outside range
- [ ] Auto-calc when valid
- [ ] Mint button states correct
- [ ] UniSat payment works

---

## 📞 Quick Help

**File too large?** → Decrease quality slider  
**File too small?** → Increase quality slider  
**No auto-calc?** → Check file is 200-400kb  
**Mint disabled?** → Check all conditions met  
**Payment error?** → Check parseInt() conversion
