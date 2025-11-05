# 📚 Legacy Notes - Degen Minter

**Original minting flow and BRC-20 reference (for historical context)**

---

## ⚠️ Note

This file contains information about the original minting flow and BRC-20 tokens. **This is for reference only** - the current app focuses on image inscriptions with user file upload.

---

## Original Minting Flow (Pre-File Upload)

### Old User Flow

1. User connects wallet
2. App automatically calculates sats for 7.jpg
3. App displays payment details
4. User clicks "Mint"
5. User sends payment
6. Inscription created

### Key Differences from Current Flow

| Feature | Old | New |
|---------|-----|-----|
| File source | Fixed 7.jpg | User upload |
| Calculation trigger | Wallet connection | File valid (200-400kb) |
| File size control | None | Quality slider |
| File validation | None | 200kb-400kb range |

---

## BRC-20 Token Information

### What are BRC-20 Tokens?

BRC-20 is a token standard on Bitcoin using Ordinals inscriptions. Similar to ERC-20 on Ethereum, but for Bitcoin.

### BRC-20 vs Image Inscriptions

| Feature | BRC-20 | Image Inscription |
|---------|--------|-------------------|
| Content | JSON text | Image file |
| Size | Very small (~100 bytes) | 200kb-400kb |
| Purpose | Fungible tokens | NFTs, art |
| Metadata | Token name, supply | Image data |

### BRC-20 Example

```json
{
  "p": "brc-20",
  "op": "deploy",
  "tick": "ordi",
  "max": "21000000",
  "lim": "1000"
}
```

**Note:** Current app does NOT support BRC-20 tokens, only image inscriptions.

---

## Original mint-button-instructions.md

The file `mint-button-instructions.md` contains detailed information about:
- BRC-20 token deployment
- BRC-20 token minting
- BRC-20 token transfers
- Original minting flow

**Status:** Kept for reference but not part of current implementation.

---

## API Response Fields (Historical)

### inscription_id Field

**Returned by API:** Yes  
**Displayed to User:** No (per current requirements)  
**Purpose:** Track inscription status on Skrybit backend  
**Usage:** Could be used for status tracking in future

### Why Hide inscription_id?

**User Requirement:** Simplified UI  
**Reasoning:** Users only need payment information  
**Future:** Could add optional status tracking feature

---

## Fixed 7.jpg Approach (Deprecated)

### How It Worked

```typescript
// Backend (API route)
const imagePath = path.join(process.cwd(), '7.jpg')
const imageBuffer = fs.readFileSync(imagePath)

// Send to Skrybit
formData.append('file', imageBuffer, {
  filename: '7.jpg',
  contentType: 'image/jpeg',
})
```

### Why Changed?

- ❌ All users inscribed same image
- ❌ No user control
- ❌ Limited use case
- ✅ Now: Users upload their own images
- ✅ Now: More flexible and useful

---

## Auto-Calculation on Wallet Connection (Deprecated)

### Old Behavior

```typescript
useEffect(() => {
  if (walletAddress) {
    calculateInscription()  // Auto-calculate immediately
  }
}, [walletAddress])
```

### Why Changed?

- ❌ Calculated before user uploaded file
- ❌ Not relevant until file is ready
- ✅ Now: Calculate when file is valid
- ✅ Now: Better user experience

---

## Component Evolution

### WalletConnect Component

**v1.0:** Basic connect/disconnect  
**v1.1:** Added mounted state (hydration fix)  
**v2.0:** No changes (still works same way)

### MintButton Component

**v1.0:** Basic button with onClick  
**v1.1:** Added parseInt() conversion  
**v2.0:** Added conditional states and disabled reasons

### StatusDisplay Component

**v1.0:** Basic status messages  
**v1.1:** Added inscription_id display  
**v2.0:** Removed inscription_id display, added file size info

---

## Fee Rate Evolution

### v1.0
- Integer only (1, 2, 3...)
- Min: 1 sats/vB
- No decimals

### v1.1
- Decimal support (0.1, 0.5, 1.5...)
- Min: 0.1 sats/vB
- Step: 0.1

### v2.0
- Same as v1.1
- No changes to fee rate handling

---

## Known Issues (Historical)

### Issue 1: Hydration Error
**Status:** ✅ Fixed in v1.1  
**Solution:** Mounted state in WalletConnect

### Issue 2: parseInt() Error
**Status:** ✅ Fixed in v1.0  
**Solution:** Always use parseInt() for UniSat amounts

### Issue 3: Decimal Fee Rate
**Status:** ✅ Fixed in v1.1  
**Solution:** Use parseFloat() instead of parseInt()

### Issue 4: Flashing Compression
**Status:** ✅ Fixed in v2.0  
**Solution:** Compress on release, not real-time

### Issue 5: 100% Compression
**Status:** ✅ Fixed in v2.0  
**Solution:** Skip compression library at 100%

---

## Lessons Learned

### What Worked Well
- ✅ Server-side API proxy pattern
- ✅ UniSat wallet integration
- ✅ Tailwind CSS for styling
- ✅ Next.js 14 App Router
- ✅ TypeScript for type safety

### What Needed Improvement
- ❌ Fixed file approach (too limiting)
- ❌ Auto-calc on wallet connect (too early)
- ❌ No file size control (needed for blockchain)
- ❌ Real-time compression (performance issues)

### Key Takeaways
1. User control is important (file upload)
2. Validation is critical (file size)
3. Performance matters (compress on release)
4. UX details matter (delayed indicators)
5. Type conversion is critical (parseInt for UniSat)

---

## Migration Path

### From v1.x to v2.0

**Breaking Changes:**
- Must implement file upload
- Must implement quality slider
- Must remove fixed 7.jpg dependency
- Must update API route

**Non-Breaking:**
- Wallet integration (same)
- Fee rate handling (same)
- Environment variables (same)
- API authentication (same)

**Recommended Steps:**
1. Read `01-REQUIREMENTS.md`
2. Follow `02-IMPLEMENTATION-GUIDE.md`
3. Test thoroughly
4. Deploy

---

## Reference Documentation

### Still Relevant
- UniSat wallet integration
- Skrybit API authentication
- parseInt() conversion
- Hydration error fix
- Decimal fee rate support

### Deprecated
- Fixed 7.jpg approach
- Auto-calc on wallet connection
- CalculateButton component

### New in v2.0
- File upload system
- Quality slider
- File size validation
- Compress on release pattern
- Delayed indicators

---

## Future Considerations

### Potential Features
- BRC-20 token support (separate mode)
- Multiple file types (video, audio)
- Batch inscriptions
- Inscription history
- Status tracking with inscription_id

### Technical Debt
- None currently
- Well-documented
- Clean architecture
- Good test coverage needed

---

**This file is for reference only. For current implementation, see:**
- `00-START-HERE.md`
- `01-REQUIREMENTS.md`
- `02-IMPLEMENTATION-GUIDE.md`
