# 🤖 AI BUILD INSTRUCTIONS - Degen Minter

**Audience**: AI Coding Agents (Claude, GPT, etc.)  
**Last Updated**: November 3, 2025  
**Project Status**: 📋 **SPECIFICATIONS ONLY - BUILD FROM SCRATCH**

---

## ⚠️ IMPORTANT NOTICE FOR AI AGENTS

**THERE IS NO EXISTING APPLICATION.**

These are **complete build instructions** for AI agents to create the Degen Minter app from scratch.

**Your Task:**
- Create a new Next.js 14 project from scratch
- Install all dependencies listed in these docs
- Build all components according to specifications
- Implement all features as documented
- Follow all critical implementation notes
- **BUILD THE APP ONLY - Do not create or modify documentation**

**🚫 DO NOT:**
- ❌ Search for existing source code
- ❌ Look for existing components or files
- ❌ Check for a running application
- ❌ Try to modify existing code
- ❌ Create README files or additional documentation
- ❌ Write setup guides or usage instructions

**✅ DO:**
- ✅ Start with `npx create-next-app@14`
- ✅ Build everything from these specifications
- ✅ Create all files and components as documented
- ✅ Focus ONLY on writing application code
- ✅ All documentation already exists - just build the app

**These instructions are optimized for AI agents** but can also be used by human developers.

---

## 📋 Quick Navigation

### 👤 I am a...

**🤖 AI Agent Building This App**
1. Read this file first
2. Then: `01-REQUIREMENTS.md` - Core requirements
3. Then: `02-IMPLEMENTATION-GUIDE.md` - How to build it
4. Reference: `03-TECHNICAL-SPECS.md` - Technical details
5. Reference: `04-COMPONENT-SPECS.md` - Component specifications

**👨‍💻 Developer**
1. Read this file first
2. Then: `01-REQUIREMENTS.md` - What to build
3. Then: `02-IMPLEMENTATION-GUIDE.md` - How to build it
4. Reference: `05-QUICK-REFERENCE.md` - Quick lookup

**📚 Reviewing Documentation**
1. Read this file first
2. Then: `01-REQUIREMENTS.md` - Overview
3. Optional: All other files for details

---

## 🎯 Project Overview

**Degen Minter** is a Next.js 14 application for creating Bitcoin Ordinals inscriptions using the Skrybit API.

**⚠️ This app does not exist yet.** These are the specifications to build it from scratch.

### Key Features
- 🔗 **Wallet Connection**: UniSat wallet integration for Bitcoin payments
- 🎨 **AI Image Instructions**: Guide users to generate Degent images (Pepe in tuxedo)
- 📤 **File Upload**: Users upload image files (jpg, png, gif, webp)
- 🎚️ **Quality Slider**: Compress images to 200kb-400kb range
- ✅ **Validation**: Real-time file size validation with visual feedback
- 🔄 **Auto-Calculate**: Automatic sats calculation when file is valid
- 💰 **UniSat Integration**: Secure Bitcoin wallet payments
- 🖼️ **Image Preview**: See compressed image before minting
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS

---

## 🆕 What's New (November 2025)

### Major Update: File Upload Feature

**Before:**
- ❌ Fixed 7.jpg file for all users
- ❌ No file upload
- ❌ Calculation on wallet connection

**After:**
- ✅ Users upload their own images
- ✅ Quality slider for compression
- ✅ File size validation (200kb-400kb)
- ✅ Calculation when file is valid

---

## 📁 Documentation Structure

### Core Documentation (Read in Order)
1. **00-START-HERE.md** (this file) - Overview and navigation
2. **01-REQUIREMENTS.md** - Complete requirements and specifications
3. **02-IMPLEMENTATION-GUIDE.md** - Step-by-step implementation guide
4. **03-TECHNICAL-SPECS.md** - Technical architecture and API details
5. **04-COMPONENT-SPECS.md** - Detailed component specifications
6. **05-QUICK-REFERENCE.md** - Quick reference for developers

### Reference Documentation
7. **06-CHANGELOG.md** - Bug fixes and improvements history
8. **07-LEGACY-NOTES.md** - Original minting flow (for reference)

### Support Files
- `.env` - Environment variables (not in git)
- `7.jpg` - Sample image (can be removed)

---

## ✅ Implementation Checklist

### Prerequisites
- [ ] Node.js 14+ installed
- [ ] UniSat wallet for testing
- [ ] Skrybit API access (JWT token)

### Setup
- [ ] Clone/create project
- [ ] Install dependencies
- [ ] Configure environment variables
- [ ] Review requirements (01-REQUIREMENTS.md)

### Development
- [ ] Read implementation guide (02-IMPLEMENTATION-GUIDE.md)
- [ ] Build components (04-COMPONENT-SPECS.md)
- [ ] Implement API routes (03-TECHNICAL-SPECS.md)
- [ ] Test all features
- [ ] Deploy

---

## 🔑 Critical Requirements Summary

### File Upload
- **Types**: jpg, png, gif, webp only
- **Size**: Must be 200kb-400kb to mint
- **Method**: Click or drag-and-drop

### Quality Slider
- **Range**: 10% to 100%
- **Default**: 100% (no compression on upload)
- **Behavior**: Compress on release, not during drag
- **At 100%**: Uses original file without processing

### Validation
- **Visual**: Green (valid) / Red (invalid)
- **Display**: Original size + Compressed size
- **Auto-Calculate**: When file enters valid range

### Mint Button
**Enabled ONLY when:**
- ✅ Wallet connected
- ✅ File uploaded
- ✅ File is 200kb-400kb
- ✅ Calculation complete

### Display Rules
- ✅ **Show**: wallet address, file sizes, required sats, payment address
- ❌ **Hide**: inscription_id (API returns it but don't display)

---

## 🚨 Critical Implementation Notes

### 1. Quality Slider Default (100%)
```typescript
const [quality, setQuality] = useState(100)
```
**Why**: Users see original file size first, no surprise compression

### 2. Skip Compression at 100%
```typescript
if (quality === 100) {
  // Use original file, no processing
  setCompressedFile(originalFile)
} else {
  // Compress with browser-image-compression
}
```
**Why**: True 1:1 representation, saves processing time

### 3. Compress on Release (Not Real-time)
```typescript
<input
  type="range"
  onMouseUp={handleSliderRelease}   // Desktop
  onTouchEnd={handleSliderRelease}  // Mobile
/>
```
**Why**: Prevents flashing "Compressing..." text, smoother UX

### 4. parseInt() for UniSat Wallet
```typescript
const amountInSats = parseInt(requiredSats)
await window.unisat.sendBitcoin(paymentAddress, amountInSats)
```
**Why**: Prevents "0.00000000 BTC" error in UniSat wallet

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Wallet**: UniSat Wallet SDK
- **API**: Skrybit API for inscriptions
- **HTTP**: Axios
- **Compression**: browser-image-compression

---

## 📞 Quick Help

### Common Questions

**Q: Where do I start?**  
A: Read `01-REQUIREMENTS.md` next, then `02-IMPLEMENTATION-GUIDE.md`

**Q: How does the quality slider work?**  
A: See `04-COMPONENT-SPECS.md` → QualitySlider section

**Q: What's the file size limit?**  
A: 200kb minimum, 400kb maximum (Bitcoin blockchain constraints)

**Q: Why hide inscription_id?**  
A: User requirement - simplified UI, only show essential info

**Q: What if I need quick reference?**  
A: Use `05-QUICK-REFERENCE.md` for quick lookups

---

## 🎯 Next Steps

1. ✅ You've read this file
2. 📖 Read `01-REQUIREMENTS.md` - Understand what to build
3. 🔨 Read `02-IMPLEMENTATION-GUIDE.md` - Learn how to build it
4. 💻 Start coding!

---

**Ready to build? Start with `01-REQUIREMENTS.md` →**
