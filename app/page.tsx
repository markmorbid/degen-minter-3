'use client';

import { useState, useEffect } from 'react';
import WalletConnect from '@/components/WalletConnect';
import AIInstructions from '@/components/AIInstructions';
import FileUpload from '@/components/FileUpload';
import FileValidation from '@/components/FileValidation';
import MintButton from '@/components/MintButton';
import StatusDisplay from '@/components/StatusDisplay';
import { createInscriptionCommit, isFileSizeValid } from '@/lib/api';
import type { InscriptionResponse } from '@/lib/api';

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [feeRate, setFeeRate] = useState(1);
  const [inscriptionData, setInscriptionData] = useState<InscriptionResponse | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [txid, setTxid] = useState<string | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  // Auto-calculate when file becomes valid or fee rate changes
  useEffect(() => {
    const shouldCalculate = 
      walletAddress &&
      compressedFile &&
      isFileSizeValid(compressedFile.size) &&
      !isCalculating &&
      !hasCalculated;

    if (shouldCalculate) {
      handleCalculate();
    }
  }, [walletAddress, compressedFile, feeRate, hasCalculated]);

  const handleCalculate = async () => {
    if (!walletAddress || !compressedFile) return;

    setIsCalculating(true);
    setInscriptionData(null);

    try {
      const data = await createInscriptionCommit(
        compressedFile,
        walletAddress, // recipient
        feeRate,
        walletAddress  // sender
      );

      setInscriptionData(data);
      setHasCalculated(true);
    } catch (error) {
      console.error('Calculation failed:', error);
      alert('Failed to calculate inscription cost. Please try again.');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleWalletConnect = (address: string) => {
    setWalletAddress(address);
  };

  const handleWalletDisconnect = () => {
    setWalletAddress(null);
    setInscriptionData(null);
    setTxid(null);
    setHasCalculated(false);
  };

  const handleFileSelect = (file: File) => {
    setOriginalFile(file);
    setCompressedFile(null);
    setInscriptionData(null);
    setTxid(null);
    setHasCalculated(false);
  };

  const handleCompressedFile = (file: File, compressing: boolean) => {
    setCompressedFile(file);
    
    // Reset calculation when file changes
    if (!compressing) {
      setInscriptionData(null);
      setHasCalculated(false);
    }
  };

  const handleMintSuccess = (transactionId: string) => {
    setTxid(transactionId);
  };

  const handleFeeRateChange = (rate: number) => {
    setFeeRate(rate);
    // Reset calculation when fee rate changes
    setInscriptionData(null);
    setHasCalculated(false);
  };

  const fileIsValid = compressedFile ? isFileSizeValid(compressedFile.size) : false;

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            🎨 Degen Minter
          </h1>
          <p className="text-gray-300 text-lg">
            Create Bitcoin Ordinals Inscriptions
          </p>
        </div>

        {/* Main Content - Single Column */}
        <div className="max-w-3xl mx-auto space-y-6">
          <WalletConnect 
            onConnect={handleWalletConnect}
            onDisconnect={handleWalletDisconnect}
          />

          <AIInstructions />

          <FileUpload 
            onFileSelect={handleFileSelect}
          />

          <FileValidation
            originalFile={originalFile}
            onCompressedFile={handleCompressedFile}
          />

          {isCalculating && (
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg text-center">
              <div className="text-bitcoin text-xl animate-pulse">
                ⏳ Calculating inscription cost...
              </div>
            </div>
          )}

          <MintButton
            walletAddress={walletAddress}
            compressedFile={compressedFile}
            isFileSizeValid={fileIsValid}
            inscriptionData={inscriptionData}
            onMintSuccess={handleMintSuccess}
          />

          <StatusDisplay
            txid={txid}
            feeRate={feeRate}
            onFeeRateChange={handleFeeRateChange}
          />
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Powered by Skrybit API • UniSat Wallet</p>
        </div>
      </div>
    </main>
  );
}
