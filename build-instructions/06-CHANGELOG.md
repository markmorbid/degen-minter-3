# 📝 Changelog - Degen Minter

**History of changes, bug fixes, and improvements**

---

## November 2025 - File Upload Feature

### Major Update: User File Upload

**Changed From:**
- Fixed 7.jpg file for all users
- Auto-calculation on wallet connection
- No file size control

**Changed To:**
- User uploads their own images
- Quality slider for compression
- File size validation (200kb-400kb)
- Auto-calculation when file is valid

### Implementation Details

#### Quality Slider Behavior
- **Default**: 100% quality (no compression on upload)
- **At 100%**: Uses original file without processing
- **Compression**: Triggers on release (not real-time)
- **Indicator**: Shows "Compressing..." only if >200ms

#### File Size Validation
- **Min**: 200kb
- **Max**: 400kb
- **Display**: Original + Compressed sizes
- **Visual**: Green (valid) / Red (invalid)

#### Auto-Calculation
- **Old**: Triggered on wallet connection
- **New**: Triggers when file enters 200kb-400kb range

#### Display Changes
- **Added**: File size display
- **Added**: Quality slider
- **Added**: Image preview
- **Removed**: inscription_id from display

---

## Previous Fixes (Pre-File Upload)

### Fix 1: React Hydration Error

**Issue:**
```
Unhandled Runtime Error
Error: Hydration failed because the initial UI does not match what was rendered on the server.
```

**Root Cause:**
WalletConnect component checking for wallet on mount caused SSR/CSR mismatch.

**Solution:**
```typescript
const [mounted, setMounted] = useState(false)

useEffect(() => {
  setMounted(true)
}, [])

if (!mounted) {
  return <button disabled>Loading...</button>
}
```

**Result:** ✅ No more hydration errors

---

### Fix 2: Decimal Fee Rate Support

**Issue:**
Fee rate input only accepted integers (1, 2, 3...).

**Root Cause:**
Using parseInt() instead of parseFloat().

**Solution:**
```typescript
// Before
const feeRate = parseInt(e.target.value)

// After
const feeRate = parseFloat(e.target.value)
```

**Configuration:**
```typescript
<input
  type="number"
  min="0.1"
  max="999"
  step="0.1"
  value={feeRate}
/>
```

**Result:** ✅ Supports 0.1, 0.5, 1.5, etc.

---

### Fix 3: Flashing Compression Indicator

**Issue:**
"Compressing..." text flashed constantly as slider moved.

**Root Cause:**
Real-time compression with debouncing still caused rapid state changes.

**Solution:**
```typescript
// Before: Compress during drag (with debounce)
onChange={(e) => debouncedCompress(e.target.value)}

// After: Compress on release
onChange={(e) => setQuality(e.target.value)}
onMouseUp={handleSliderRelease}
onTouchEnd={handleSliderRelease}
```

**Result:** ✅ Smooth slider, no flashing

---

### Fix 4: Unexpected Compression at 100%

**Issue:**
Even at 100% quality, compression library reduced file size.

**Root Cause:**
browser-image-compression always processes images.

**Solution:**
```typescript
if (quality === 100) {
  // Skip compression entirely
  onCompressionComplete(originalFile, originalFile.size)
  return
}

// Only compress if quality < 100%
const compressed = await imageCompression(originalFile, options)
```

**Result:** ✅ At 100%, compressed size = original size

---

### Fix 5: Delayed Compression Indicator

**Issue:**
"Compressing..." flashed even for very fast compressions.

**Root Cause:**
Indicator showed immediately when compression started.

**Solution:**
```typescript
const showTimeout = setTimeout(() => {
  setShowCompressing(true)
}, 200)

// After compression
clearTimeout(showTimeout)
setShowCompressing(false)
```

**Result:** ✅ Only shows if compression takes >200ms

---

## Critical Implementation Notes

### UniSat Wallet parseInt() Conversion

**Issue:**
UniSat wallet showed "0.00000000 BTC" error.

**Root Cause:**
Skrybit API returns `required_amount_in_sats` as a string, but UniSat expects integer.

**Solution:**
```typescript
// CRITICAL: Convert to integer
const amountInSats = parseInt(requiredSats)
await window.unisat.sendBitcoin(paymentAddress, amountInSats)
```

**Status:** ✅ Always implemented, documented in all files

---

## Component Structure Changes

### Before (Old Structure)
```
components/
├── WalletConnect.tsx
├── CalculateButton.tsx  ❌ Removed
├── MintButton.tsx
└── StatusDisplay.tsx
```

### After (New Structure)
```
components/
├── WalletConnect.tsx
├── FileUpload.tsx       ✅ New
├── QualitySlider.tsx    ✅ New
├── FileSizeDisplay.tsx  ✅ New
├── MintButton.tsx
└── StatusDisplay.tsx
```

---

## API Changes

### Before
```typescript
// Read 7.jpg from filesystem
const imagePath = path.join(process.cwd(), '7.jpg')
const imageBuffer = fs.readFileSync(imagePath)
```

### After
```typescript
// Accept uploaded file from FormData
const file = formData.get('file') as File
const bytes = await file.arrayBuffer()
const buffer = Buffer.from(bytes)
```

---

## Environment Variables

### No Changes
```env
NEXT_PUBLIC_AUTH_TOKEN=your_jwt_token_here
NEXT_PUBLIC_SKRYBIT_API_URL=https://api.skrybit.io
```

**Note:** Same variables, same security model (server-side only)

---

## Dependencies Added

### New Dependency
```json
{
  "browser-image-compression": "^2.0.2"
}
```

**Purpose:** Client-side image compression for quality slider

**Alternative:** Could use native Canvas API (no dependency)

---

## Breaking Changes

### For Users
- ❌ Can no longer use app without uploading file
- ✅ Can now inscribe their own images
- ✅ More control over file size

### For Developers
- ❌ Must implement FileUpload component
- ❌ Must implement QualitySlider component
- ❌ Must implement FileSizeDisplay component
- ❌ Must remove CalculateButton component
- ✅ Better user experience
- ✅ More flexible application

---

## Migration Guide

### From Old Version to New Version

1. **Remove** 7.jpg file dependency
2. **Add** browser-image-compression dependency
3. **Create** FileUpload component
4. **Create** QualitySlider component
5. **Create** FileSizeDisplay component
6. **Remove** CalculateButton component
7. **Update** API route to accept uploaded files
8. **Update** main page to handle file upload flow
9. **Test** all features thoroughly

---

## 🚀 Future Enhancements

### Planned Features

#### Fee Rate Improvements
- [ ] **Fee rate presets**: Add quick-select buttons
  - Economy: 0.1 sats/vB
  - Normal: 1 sats/vB
  - Fast: 5 sats/vB
  - Urgent: 10 sats/vB
- [ ] **Automatic fee estimation**: Integrate with mempool.space API
- [ ] **Fee rate validation**: Add maximum limit (e.g., 100 sats/vB) to prevent accidents
- [ ] **Confirmation time estimates**: Show estimated time based on fee rate
- [ ] **Real-time mempool data**: Display current network congestion

#### File Handling
- [ ] **Batch inscriptions**: Upload and inscribe multiple files at once
- [ ] **File history**: Track previously inscribed files
- [ ] **Drag-and-drop multiple files**: Queue system for batch processing
- [ ] **File preview gallery**: Show all files before batch inscription

#### Inscription Features
- [ ] **Inscription status tracking**: Monitor inscription progress after payment
- [ ] **Transaction history**: View all past inscriptions
- [ ] **Inscription explorer**: View inscribed content on blockchain
- [ ] **Custom metadata**: Add custom tags or descriptions to inscriptions
- [ ] **BRC-20 token support**: Deploy and mint BRC-20 tokens

#### Wallet Features
- [ ] **Multiple wallet support**: Add support for other Bitcoin wallets
  - Xverse Wallet
  - Leather (formerly Hiro)
  - OKX Wallet
- [ ] **Wallet switching**: Easy switching between connected wallets
- [ ] **Balance display**: Show wallet BTC balance

#### User Experience
- [ ] **Dark/Light mode toggle**: User preference for theme
- [ ] **Language support**: Internationalization (i18n)
- [ ] **Keyboard shortcuts**: Power user features
- [ ] **Accessibility improvements**: Better screen reader support
- [ ] **Tutorial/Onboarding**: First-time user guide

#### Performance
- [ ] **Lazy load compression library**: Reduce initial bundle size
- [ ] **Cache compressed images**: Avoid re-compression
- [ ] **Progressive image loading**: Better UX for large files
- [ ] **Service worker**: Offline support and caching
- [ ] **Image optimization**: Auto-optimize before compression

#### Developer Features
- [ ] **API documentation**: Detailed API reference
- [ ] **SDK/Library**: Reusable components for other projects
- [ ] **Webhook support**: Notifications for inscription completion
- [ ] **Analytics**: Track usage and performance metrics

---

## Future Improvements

### Potential Enhancements
- [ ] Batch inscriptions (multiple files)
- [ ] File history/management
- [ ] Inscription status tracking
- [ ] Support for other file types (video, audio)
- [ ] Custom inscription metadata
- [ ] BRC-20 token support
- [ ] Multiple wallet providers

### Performance Optimizations
- [ ] Lazy load compression library
- [ ] Cache compressed images
- [ ] Progressive image loading
- [ ] Service worker for offline support

---

## Version History

### v2.0 (November 2025)
- ✅ File upload feature
- ✅ Quality slider
- ✅ File size validation
- ✅ Auto-calculation improvements

### v1.1 (Previous)
- ✅ Hydration error fix
- ✅ Decimal fee rate support

### v1.0 (Initial)
- ✅ Basic inscription functionality
- ✅ Fixed 7.jpg file
- ✅ UniSat wallet integration
- ✅ Skrybit API integration
