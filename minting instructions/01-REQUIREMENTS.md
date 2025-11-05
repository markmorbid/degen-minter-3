# 📋 Requirements - Degen Minter

**Complete specification of all features and requirements**

---

## 🎯 Project Goal

Create a responsive Next.js application that allows users to upload and inscribe images on the Bitcoin blockchain using the Skrybit API, with built-in image compression to meet blockchain size constraints.

---

## ✅ Core Requirements

### 1. File Upload System

#### Accepted File Types
- ✅ JPEG (.jpg, .jpeg)
- ✅ PNG (.png)
- ✅ GIF (.gif)
- ✅ WebP (.webp)
- ❌ All other file types rejected

#### Upload Methods
- Click to browse and select file
- Drag-and-drop support
- File type validation with clear error messages

#### Validation Rules
- **Client-side**: Validate file type before upload
- **Server-side**: Validate file type and size
- **Error handling**: Clear, user-friendly error messages

---

### 2. Quality Slider & Compression

#### Slider Specifications
- **Range**: 10% to 100%
- **Default**: 100% (no compression on initial upload)
- **Step**: 1% increments
- **Visual**: Gradient slider showing quality level

#### Compression Behavior
- **At 100% quality**: Use original file without processing
- **Below 100%**: Compress using browser-image-compression library
- **Trigger**: Compress when user releases slider (not during drag)
- **Events**: onMouseUp (desktop), onTouchEnd (mobile)

#### Compression Settings
```typescript
{
  maxSizeMB: 10,
  maxWidthOrHeight: 4096,
  useWebWorker: true,
  initialQuality: quality / 100
}
```

#### User Experience
- Smooth slider movement (no lag)
- "Compressing..." indicator only if compression takes >200ms
- Real-time file size display updates after compression

---

### 3. File Size Validation

#### Size Constraints
- **Minimum**: 200kb (204,800 bytes)
- **Maximum**: 400kb (409,600 bytes)
- **Reason**: Bitcoin blockchain size constraints

#### Visual Feedback
- **Green border + ✓**: File is within valid range (200kb-400kb)
- **Red border + ✗**: File is outside valid range
- **Helper text**: 
  - "File too small. Increase quality slider."
  - "File too large. Decrease quality slider."
  - "File size is valid! Ready to mint."

#### Display Requirements
- Show **original file size** (from uploaded file)
- Show **compressed file size** (after quality adjustment)
- Format: "250kb" (rounded to nearest kb)
- Update in real-time after compression

---

### 4. Auto-Calculation

#### Trigger Conditions
Auto-calculate required sats when **ALL** of these are true:
- ✅ Wallet is connected
- ✅ File is uploaded
- ✅ File size is between 200kb-400kb
- ✅ Has not already calculated for this file

#### Calculation Process
1. Send file to `/api/inscriptions/create-commit`
2. API calculates required sats based on:
   - File size
   - Fee rate (sats/vbyte)
   - Bitcoin transaction size
3. Display results to user

#### What NOT to Trigger On
- ❌ Wallet connection (old behavior - removed)
- ❌ Fee rate change
- ❌ File outside valid range

---

### 5. Wallet Integration

#### Wallet Provider
- **UniSat Wallet** (Bitcoin wallet)
- Browser extension required

#### Wallet Functions
- Connect wallet
- Disconnect wallet
- Get wallet address
- Send Bitcoin transaction

#### Address Usage
- Connected wallet address used as **both**:
  - Sender address
  - Recipient address (inscription sent back to user)

#### Critical Implementation
```typescript
// MUST convert to integer for UniSat
const amountInSats = parseInt(requiredSats)
await window.unisat.sendBitcoin(paymentAddress, amountInSats)
```
**Why**: Without parseInt(), UniSat shows "0.00000000 BTC" error

---

### 6. AI Image Generation Instructions

#### Purpose
Provide users with clear instructions on how to generate their own "Degent" image using AI tools before uploading.

#### Section Placement
- Display **after** wallet connection section
- Display **before** file upload section
- Always visible (not conditional)

#### Required Content

**Title**: "🎨 Create Your Degent Image"

**Instructions**:
1. **Image Requirements**:
   - Must be Pepe in a tuxedo
   - Bowtie is **mandatory**
   - Must include text: "DEGEN", "DEGENT", or "REGEN"

2. **How to Generate**:
   - Use any AI image generator (ChatGPT, Midjourney, etc.)
   - Upload our sample image (7.jpg) as reference
   - Prompt: "Make one like this"

3. **Sample Image Preview & Download**:
   - Display 7.jpg as a visual preview (thumbnail)
   - Image size: 192px x 192px (w-48 h-48)
   - Rounded corners with blue border
   - Provide download button next to preview
   - Button text: "Download Sample (7.jpg)"
   - File should download directly when clicked

#### Visual Design
- Use an info/help style box (light background)
- Include emoji icons for visual appeal
- Display 7.jpg preview image (192x192px)
- Image and download button side-by-side on desktop, stacked on mobile
- Make download button prominent
- Use clear, concise bullet points

#### Implementation Notes
- 7.jpg must be in `/public/` folder for download
- Download button should trigger direct file download
- Section should be collapsible/expandable (optional enhancement)

---

### 7. Minting Flow

#### Mint Button States

**Enabled when:**
- ✅ Wallet connected
- ✅ File uploaded
- ✅ File is 200kb-400kb
- ✅ Calculation complete (have required sats and payment address)

**Disabled when:**
- ❌ No wallet connected → "Connect wallet to continue"
- ❌ No file uploaded → "Upload a file to continue"
- ❌ File too small → "File too small (min: 200kb)"
- ❌ File too large → "File too large (max: 400kb)"
- ❌ Calculation in progress → "Calculating..."
- ❌ Calculation failed → "Calculation failed. Try again."

#### Mint Process
1. User clicks "Mint" button
2. UniSat wallet prompts for payment
3. User sends exact sats to payment address
4. Transaction confirmed on blockchain
5. Inscription created and sent to user's wallet

---

### 8. Display Requirements

#### What to Display
- ✅ Connected wallet address
- ✅ Original file size
- ✅ Compressed file size
- ✅ File size validation status (green/red)
- ✅ Required sats amount
- ✅ Payment address
- ✅ Fee rate (sats/vbyte)
- ✅ Image preview (compressed version)

#### What NOT to Display
- ❌ **inscription_id** (API returns it but don't show to user)

**Why hide inscription_id?**
- User requirement: Simplified UI
- Only show essential payment information

---

### 8. Fee Rate Configuration

#### Default Value
- **Default**: 1 sats/vB
- **Minimum**: 0.1 sats/vB
- **Maximum**: 999 sats/vB
- **Step**: 0.1 increments

#### User Control
- Input field to adjust fee rate
- Higher fee = faster confirmation
- Lower fee = slower confirmation
- **Debouncing**: Wait 500ms after user stops typing before triggering recalculation
- Prevents multiple API calls when user changes fee rate quickly
- Show loading state during recalculation

---

### 9. Image Preview

#### Display
- Show **compressed image** (not original)
- Update preview when quality slider changes
- Maximum display size: Fit within container
- Maintain aspect ratio

#### Purpose
- User sees exactly what will be inscribed
- Visual confirmation before minting

---

### 9. AI Image Instructions Display

#### Content to Display
- Clear, numbered instructions
- Visual hierarchy (title, bullets, button)
- Sample image preview (optional)

#### Download Button
- Text: "Download Sample (7.jpg)"
- Style: Secondary button (not primary like "Mint")
- Action: Direct download of 7.jpg file
- Icon: Download icon (⬇️ or similar)

---

### 10. Responsive Design

#### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

#### Mobile Considerations
- Touch-friendly slider controls
- Drag-and-drop file upload
- Readable text sizes
- Accessible buttons

#### Desktop Considerations
- Optimal layout for larger screens
- Mouse-friendly interactions
- Keyboard navigation support

---

## 🔐 Security Requirements

### 1. API Authentication
- JWT token stored in `.env` file
- Token only used in server-side API routes
- Never exposed to client-side code

### 2. File Validation
- **Client-side**: Validate file type and size
- **Server-side**: Re-validate everything
- Reject invalid files with clear errors

### 3. Wallet Security
- Never request or store private keys
- Use UniSat SDK properly
- All transactions user-initiated

### 4. Environment Variables
```
NEXT_PUBLIC_AUTH_TOKEN=your_jwt_token_here
NEXT_PUBLIC_SKRYBIT_API_URL=https://api.skrybit.io
```
- Never commit `.env` to git
- Use `.env.local` for local overrides

---

## 🎨 UI/UX Requirements

### Visual Design
- Modern, clean interface
- Gradient backgrounds
- Card-based layout
- Clear visual hierarchy

### Color Scheme
- Primary: Bitcoin orange (#F7931A)
- Success: Green (#10B981)
- Error: Red (#EF4444)
- Background: Dark gradient (gray-900 to purple-900)

### Typography
- Clear, readable fonts
- Appropriate sizes for hierarchy
- Good contrast for accessibility

### Feedback
- Loading states for async operations
- Success/error messages
- Progress indicators
- Disabled state explanations

---

## 📊 Performance Requirements

### Compression Performance
- Use web workers (don't block UI)
- Show loading indicator only if >200ms
- Optimize for mobile devices

### File Handling
- Clean up object URLs (prevent memory leaks)
- Efficient file reading
- No unnecessary re-compressions

### API Calls
- Single calculation per valid file
- Proper error handling
- Timeout handling

---

## ✅ Acceptance Criteria

### File Upload
- [ ] Accepts jpg, png, gif, webp files
- [ ] Rejects other file types with clear error
- [ ] Supports drag-and-drop
- [ ] Supports click to browse

### Quality Slider
- [ ] Defaults to 100% quality
- [ ] At 100%, compressed size = original size
- [ ] Compresses on release, not during drag
- [ ] Shows "Compressing..." only if >200ms
- [ ] Updates file size display after compression

### Validation
- [ ] Green indicator when 200kb-400kb
- [ ] Red indicator when outside range
- [ ] Clear helper messages
- [ ] Displays both original and compressed sizes

### Auto-Calculation
- [ ] Triggers when file enters valid range
- [ ] Does NOT trigger on wallet connection
- [ ] Shows loading state during calculation
- [ ] Displays required sats and payment address

### Mint Button
- [ ] Enabled only when all conditions met
- [ ] Clear disabled state messages
- [ ] Triggers UniSat wallet payment
- [ ] parseInt() conversion applied

### Display
- [ ] Shows all required information
- [ ] Does NOT show inscription_id
- [ ] Image preview shows compressed version
- [ ] Responsive on all screen sizes

---

## ⚠️ Known Limitations

### Current Limitations
- Fee rate must be manually entered (no automatic estimation)
- No upper limit validation (users could accidentally enter very high fee rates)
- No real-time mempool data integration
- No automatic fee rate recommendations
- Single file upload only (no batch processing)
- No transaction history tracking
- No inscription status monitoring after payment

### Future Considerations
- Could add fee rate presets (Economy: 0.1, Normal: 1, Fast: 5, Urgent: 10)
- Could implement fee rate estimation based on current mempool
- Could add validation to prevent extremely high fee rates (e.g., max 100 sats/vB)
- Could show estimated confirmation time based on fee rate

---

## 📝 Error Messages

### File Upload Errors
- **Invalid file type**: "Only image files (jpg, png, gif, webp) are accepted"
- **No file selected**: "Please upload an image file"

### File Size Errors
- **File too small**: "File is too small. Minimum size is 200kb. Increase quality slider."
- **File too large**: "File is too large. Maximum size is 400kb. Decrease quality slider."
- **Compression failed**: "Failed to compress image. Please try a different file."

### Wallet Errors
- **Wallet not installed**: "UniSat wallet not detected. Please install the UniSat browser extension."
- **Connection failed**: "Failed to connect wallet. Please try again."
- **No wallet connected**: "Connect wallet to continue"

### Calculation Errors
- **Missing data**: "Inscription data not available. Please try again."
- **API error**: "Failed to calculate inscription cost. Please try again."
- **Network error**: "Network error. Please check your connection."

### Minting Errors
- **Payment failed**: "Failed to send payment. Please try again."
- **Fee rate too low**: "Failed to send payment. Fee rate may be too low."
- **UniSat error**: "Error adding output" (caused by not using parseInt())
- **Amount display error**: "0.00000000 BTC" in UniSat (caused by not using parseInt())

---

## 🚫 Non-Requirements

### What NOT to Build
- ❌ Multiple file upload (single file only)
- ❌ File history/management
- ❌ User accounts/authentication
- ❌ Inscription status tracking UI
- ❌ BRC-20 token support (images only)
- ❌ Batch inscriptions
- ❌ Custom inscription metadata

---

## 📝 Summary

### Must Have
1. File upload (jpg, png, gif, webp)
2. Quality slider (10-100%, default 100%)
3. File size validation (200kb-400kb)
4. Auto-calculation when valid
5. UniSat wallet integration
6. Mint button with proper states
7. Hide inscription_id from display

### Critical Details
- Compress on release, not real-time
- Skip compression at 100% quality
- parseInt() for UniSat amounts
- Both client and server validation
- Delayed compression indicator

---

**Next**: Read `02-IMPLEMENTATION-GUIDE.md` to learn how to build this →
