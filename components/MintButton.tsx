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
}

export default function MintButton({
  walletAddress,
  compressedFile,
  isFileSizeValid,
  inscriptionData,
  onMintSuccess,
}: MintButtonProps) {
  const [isMinting, setIsMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    if (!inscriptionData) return 'Calculating...';
    return '';
  };

  const handleMint = async () => {
    if (!isEnabled || !inscriptionData) return;

    setIsMinting(true);
    setError(null);

    try {
      // CRITICAL: Convert to integer to prevent "0.00000000 BTC" error
      const amountInSats = parseInt(inscriptionData.required_amount_in_sats);
      
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
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <button
        onClick={handleMint}
        disabled={!isEnabled}
        className={`
          w-full font-bold py-4 px-6 rounded-lg text-lg transition-all
          ${isEnabled
            ? 'bg-bitcoin hover:bg-orange-600 text-white cursor-pointer transform hover:scale-105'
            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }
        `}
      >
        {isMinting ? '⏳ Minting...' : '🚀 Mint Inscription'}
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

      {inscriptionData && (
        <div className="mt-4 pt-4 border-t border-gray-700 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Required Amount:</span>
            <span className="text-white font-semibold">
              {parseInt(inscriptionData.required_amount_in_sats).toLocaleString()} sats
            </span>
          </div>
          <div>
            <p className="text-gray-400 mb-1">Payment Address:</p>
            <p className="text-white font-mono text-xs bg-gray-900 p-2 rounded break-all">
              {inscriptionData.payment_address}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
