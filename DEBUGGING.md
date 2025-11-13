# Debugging Guide for Degen Minter

## Common Issues

### 1. "0.00000000 BTC" Error

**Symptom:** UniSat wallet shows "Spend Amount: 0.00000000 BTC" when trying to mint.

**Root Cause:** The satoshi amount being passed to UniSat's `sendBitcoin()` function is invalid (NaN, 0, or negative).

**Possible Causes:**
- API returns empty/null `required_amount_in_sats`
- String-to-integer conversion fails
- Race condition where stale data is used
- Network error during calculation

**How to Debug:**

1. **Check Browser Console Logs:**
   - Look for "Sending Bitcoin:" log with the amount details
   - Look for "UniSat sendBitcoin called with:" log
   - Check if `amountInSats` is a valid positive number

2. **Check Network Tab:**
   - Inspect the response from `/api/inscriptions/create-commit`
   - Verify `required_amount_in_sats` is present and valid
   - Check for any API errors

3. **Verify Inscription Data:**
   - Open React DevTools
   - Check the `inscriptionData` state in the main page component
   - Ensure `required_amount_in_sats` is a valid string number

**Fixes Applied:**

✅ **MintButton.tsx** - Added validation before sending:
```typescript
const amountInSats = parseInt(inscriptionData.required_amount_in_sats);

if (isNaN(amountInSats) || amountInSats <= 0) {
  throw new Error('Invalid inscription amount. Please try recalculating.');
}
```

✅ **wallet.ts** - Added second layer of validation:
```typescript
const amount = parseInt(amountInSats.toString());

if (isNaN(amount) || amount <= 0) {
  throw new Error('Invalid Bitcoin amount. Amount must be positive.');
}
```

✅ **route.ts** - Added API response validation:
```typescript
const amountInSats = parseInt(required_amount_in_sats);
if (isNaN(amountInSats) || amountInSats <= 0) {
  return NextResponse.json({ error: 'Invalid inscription amount' }, { status: 500 });
}
```

**User Instructions:**
If you see this error:
1. Check the browser console for error messages
2. Try refreshing the page
3. Disconnect and reconnect your wallet
4. Re-upload your image and try again
5. If the issue persists, the Skrybit API may be having issues

---

## 2. Calculating Message Flicker

**Status:** ✅ FIXED

**Solution:** Implemented debouncing and proper state management to prevent UI flickering during fee rate changes.

---

## 3. File Size Issues

**Symptom:** File won't validate or compress properly.

**Solutions:**
- Use the quality slider to adjust compression
- Target range: 200kb-400kb
- If file is too small, increase quality
- If file is too large, decrease quality

---

## 4. Wallet Connection Issues

**Symptom:** Can't connect UniSat wallet.

**Solutions:**
- Ensure UniSat browser extension is installed
- Check that you're on a supported browser (Chrome, Brave, Edge)
- Try refreshing the page
- Check browser console for specific errors

---

## Logging Strategy

The app now includes comprehensive logging at key points:

1. **MintButton.tsx:** Logs the amount being sent before calling wallet
2. **wallet.ts:** Logs the exact parameters sent to UniSat
3. **route.ts:** Logs successful API responses with all data

To enable verbose logging, open browser console and check for:
- `Sending Bitcoin:` - Shows what's being sent from UI
- `UniSat sendBitcoin called with:` - Shows what wallet receives
- `Inscription commit created successfully:` - Shows API response data

---

## Production Deployment Checklist

Before deploying to production:

- [ ] Verify `NEXT_PUBLIC_AUTH_TOKEN` is set in environment
- [ ] Test with multiple browsers (Chrome, Brave, Edge)
- [ ] Test with different file sizes (200kb, 300kb, 400kb)
- [ ] Test with different fee rates (1, 10, 50, 100 sat/vb)
- [ ] Verify error messages are user-friendly
- [ ] Check that all console.log statements are appropriate for production
- [ ] Test wallet connection/disconnection flow
- [ ] Verify transaction IDs are displayed correctly

---

## Contact & Support

If issues persist:
1. Check browser console for detailed error messages
2. Verify Skrybit API status
3. Test with a different wallet address
4. Contact Degent Club support at https://degent.club
