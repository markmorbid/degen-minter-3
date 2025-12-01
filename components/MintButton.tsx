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
    <div className="degent-card">
      <h2 className="degent-title h2">
        <span className="icon-square">
          <i className="fa-solid fa-rocket text-degent-green"></i>
        </span>
        <span>It's time to <strong>Submit your Degent!</strong></span>
      </h2>
      {/* Fee Rate Input */}
      <div className="degent-card-2">
        <label className="label-icon">
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
        <p className="info-text"><i className="fa-circle-info fas"></i>Higher fee rates result in faster confirmation times (minimum: 0.1 sat/vb)</p>
      </div>

       {isCalculating && calculatingFeeRate !== null ? (
        <div className="mt-4 pt-4 border-t border-gray-700 text-center">
          <div className="text-bitcoin text-md animate-pulse">
             <i className="fas fa-hourglass-start mr-2"></i> Calculating inscription cost at {calculatingFeeRate} sat/vb...
          </div>
        </div>
      ) : inscriptionData ? (
        <div className="degent-card-2">
          <div className="degent-field-bg">
            <span className="text-gray-400">Required Amount:</span>
            <strong>
              {parseInt(inscriptionData.required_amount_in_sats).toLocaleString()} sats
            </strong>
          </div>
          <div className="degent-field-bg">
            <p className="text-gray-400 mb-1">Payment Address:</p>
            <p className="text-bitcoin text-sm">
              {inscriptionData.payment_address}
            </p>
          </div>
        </div>
      ) : null}

      {/* Mint Button */}
      <button
        onClick={handleMint}
        disabled={!isEnabled}
        className={`
          w-full btn btn-flex
          ${isEnabled
            ? 'btn-gradient cursor-pointer'
            : 'btn-disabled'
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
        <p className="info-text">
          <i className="fa-circle-info fas"></i>
          <span className="disabled-reason">{getDisabledReason()}</span></p>
      )}

      {error && (
        <div className="info-text status error">
          <i className="fas fa-exclamation-triangle"></i>
          {error}
        </div>
      )}
    </div>
  );
}
