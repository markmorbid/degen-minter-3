'use client';

import { useState } from 'react';
import { sendBitcoin } from '@/lib/wallet';

interface MintButtonProps {
  walletAddress: string | null;
  compressedFile: File | null;
  isFileSizeValid: boolean;
  inscriptionData: {
    payment_address: string;
    required_amount_in_sats: string;
  } | null;
  onMintSuccess: (txid: string) => void;
  isCalculating?: boolean;
  calculatingFeeRate?: number | null;
  feeRate: number;
  onFeeRateChange: (rate: number) => void;
}

export default function MintButton({
  walletAddress,
  compressedFile,
  isFileSizeValid,
  inscriptionData,
  onMintSuccess,
  isCalculating = false,
  calculatingFeeRate = null,
  feeRate,
  onFeeRateChange,
}: MintButtonProps) {
  const [isMinting, setIsMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFeeRateChange = (value: number) => {
    // Enforce minimum of 0.1 sats/vb
    if (value < 0.1) {
      onFeeRateChange(0.1);
    } else {
      onFeeRateChange(value);
    }
  };

  const isEnabled =
    walletAddress &&
    compressedFile &&
    isFileSizeValid &&
    inscriptionData &&
    !isMinting;

  const getDisabledReason = () => {
    if (!walletAddress) return 'Connect wallet to continue';
    if (!compressedFile) return 'Please upload an image file';
    if (!isFileSizeValid) return 'File must be 200kb-400kb';
    if (!inscriptionData && !isCalculating) return 'Calculating...';
    return '';
  };

  const handleMint = async () => {
    if (!isEnabled || !inscriptionData) return;

    setIsMinting(true);
    setError(null);

    try {
      // CRITICAL: Convert to integer to prevent "0.00000000 BTC" error
      const amountInSats = parseInt(inscriptionData.required_amount_in_sats);

      // Validate the amount is a valid positive integer
      if (isNaN(amountInSats) || amountInSats <= 0) {
        throw new Error(
          `Invalid inscription amount: ${inscriptionData.required_amount_in_sats}. ` +
          'Please try recalculating the inscription cost.'
        );
      }

      console.log('Sending Bitcoin:', {
        address: inscriptionData.payment_address,
        amountInSats,
        originalValue: inscriptionData.required_amount_in_sats
      });

      const txid = await sendBitcoin(
        inscriptionData.payment_address,
        amountInSats
      );

      onMintSuccess(txid);
    } catch (err: any) {
      console.error('Minting failed:', err);
      setError(err.message || 'Failed to send payment. Please try again.');
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="rounded-degent-card border border-degent-border bg-degent-card/50 backdrop-blur-sm p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-3">
        <span className="bg-degent-green/10 border border-degent-green/20 icon-square p-3 rounded-degent-button">
          <i className="fa-solid fa-rocket text-degent-green"></i>
        </span>
        <span>It's time to <span className="text-degent-green">Submit your Degent!</span></span>
      </h2>
      {/* Fee Rate Input */}
      <div className="bg-degent-input/60 border border-degent-border/50 flex flex-wrap gap-2.5 justify-center mb-6 p-4 rounded-degent-card">
        <label className="flex flex-grow gap-2 items-center text-degent-muted text-md">
          <i className="fas fa-tachometer-alt text-degent-green text-lg"></i>
          Fee Rate (sats/vbyte)
        </label>
        <input
          type="number"
          value={feeRate}
          onChange={(e) => handleFeeRateChange(Number(e.target.value))}
          onBlur={(e) => {
            // Enforce minimum on blur as well
            const value = Number(e.target.value);
            if (value < 0.1) {
              handleFeeRateChange(0.1);
            }
          }}
          min="0.1"
          step="0.1"
          className="bg-degent-input border border-degent-border flex-grow focus:border-degent-green focus:ring-1 focus:ring-degent-green outline-none px-5 py-3 rounded-degent-button text-white transition-colors w-full"
        />
        <p className="text-gray-500 text-xs mt-1">
          Higher fee rates result in faster confirmation times (minimum: 0.1 sat/vb)
        </p>
      </div>

      {/* Mint Button */}
      <button
        onClick={handleMint}
        disabled={!isEnabled}
        className={`
          w-full font-bold py-4 px-6 rounded-lg text-lg transition-all flex items-center justify-center gap-2
          ${isEnabled
            ? 'bg-degent-gradient hover:bg-degent-gradient-hover text-degent-dark cursor-pointer shadow-lg shadow-degent-green/20'
            : 'bg-degent-input text-degent-muted cursor-not-allowed border border-degent-border'
          }
        `}
      >
        {isMinting ? (
          <>
            <i className="fas fa-spinner fa-spin"></i>
            Minting...
          </>
        ) : (
          <>
            <i className="fas fa-rocket"></i>
            Mint Inscription
          </>
        )}
      </button>

      {!isEnabled && (
        <p className="mt-3 text-center text-gray-400 text-sm">
          {getDisabledReason()}
        </p>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm">
          {error}
        </div>
      )}

      {isCalculating && calculatingFeeRate !== null ? (
        <div className="mt-4 pt-4 border-t border-gray-700 text-center">
          <div className="text-bitcoin text-lg animate-pulse">
            ⏳ Calculating inscription cost at {calculatingFeeRate} sat/vb...
          </div>
        </div>
      ) : inscriptionData ? (
        <div className="bg-degent-input/60 border border-degent-border/50 flex flex-wrap gap-2.5 justify-center mb-6 p-4 rounded-degent-card text-smbg-degent-card/50 border border-degent-border/50 flex flex-col flex-wrap gap-2.5 gap-3 justify-center mb-6 mt-3 p-4 rounded-degent-card text-md">
          <div className="bg-degent-input border border-degent-border break-all flex flex-row font-mono gap-2.5 items-center p-4 rounded-degent-button text-white text-md flex justify-between">
            <span className="text-gray-400">Required Amount:</span>
            <span className="text-white font-semibold text-lg">
              {parseInt(inscriptionData.required_amount_in_sats).toLocaleString()} sats
            </span>
          </div>
          <div className="bg-degent-input border border-degent-border break-all flex flex-row font-mono gap-2.5 items-center p-4 rounded-degent-button text-white text-md flex justify-between">
            <p className="text-gray-400 mb-1">Payment Address:</p>
            <p className="text-bitcoin text-sm">
              {inscriptionData.payment_address}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
