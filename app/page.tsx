'use client';

import { useState, useEffect, useRef } from 'react';
import WalletConnect from '@/components/WalletConnect';
import AIInstructions from '@/components/AIInstructions';
import FileUpload from '@/components/FileUpload';
import FileValidation from '@/components/FileValidation';
import MintButton from '@/components/MintButton';
import StatusDisplay from '@/components/StatusDisplay';
import HeroSection from '@/components/HeroSection';
import SocialJoin from '@/components/SocialJoin';
import { createInscriptionCommit, isFileSizeValid } from '@/lib/api';
import type { InscriptionResponse } from '@/lib/api';

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [feeRate, setFeeRate] = useState(1);
  const [calculatingFeeRate, setCalculatingFeeRate] = useState<number | null>(null);
  const [isPendingCalculation, setIsPendingCalculation] = useState(false);
  const [inscriptionData, setInscriptionData] = useState<InscriptionResponse | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [txid, setTxid] = useState<string | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [calculationError, setCalculationError] = useState<string | null>(null);
  
  // Track the current fee rate to prevent race conditions
  const currentFeeRateRef = useRef(feeRate);
  // Track if we need to recalculate after current calculation finishes
  const needsRecalculationRef = useRef(false);
  // AbortController to cancel in-flight requests
  const abortControllerRef = useRef<AbortController | null>(null);
  // Debounce timer for fee rate changes
  const feeRateDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  // Track if we've shown an error alert to prevent spam
  const hasShownErrorRef = useRef(false);

  // Debounce fee rate changes - wait 1 second after user stops changing before calculating
  useEffect(() => {
    const feeRateChanged = currentFeeRateRef.current !== feeRate;
    currentFeeRateRef.current = feeRate;
    
    // If fee rate changed, reset hasCalculated and clear any existing debounce timer
    if (feeRateChanged) {
      setHasCalculated(false);
      
      // Keep calculating state visible if conditions are met
      if (walletAddress && compressedFile && isFileSizeValid(compressedFile.size)) {
        setIsPendingCalculation(true);
        setCalculatingFeeRate(feeRate);
      }
      
      // Clear existing debounce timer
      if (feeRateDebounceTimerRef.current) {
        clearTimeout(feeRateDebounceTimerRef.current);
      }
      
      // If currently calculating, abort it
      if (isCalculating) {
        console.log('Fee rate changed during calculation - aborting current request');
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
      }
    }
    
    // Cleanup function to clear timer on unmount
    return () => {
      if (feeRateDebounceTimerRef.current) {
        clearTimeout(feeRateDebounceTimerRef.current);
      }
    };
  }, [feeRate, isCalculating, walletAddress, compressedFile]);

  // Auto-calculate when file becomes valid or fee rate changes (with debounce for fee rate)
  useEffect(() => {
    // Don't auto-retry if there's an error - check current state
    const shouldCalculate = 
      walletAddress &&
      compressedFile &&
      isFileSizeValid(compressedFile.size) &&
      !isCalculating &&
      !hasCalculated &&
      !calculationError; // Don't auto-retry if there's an error

    if (shouldCalculate) {
      // Clear any existing debounce timer
      if (feeRateDebounceTimerRef.current) {
        clearTimeout(feeRateDebounceTimerRef.current);
      }
      
      // Clear any previous error when starting new calculation
      setCalculationError(null);
      hasShownErrorRef.current = false;
      
      // Show calculating state immediately
      setIsPendingCalculation(true);
      setCalculatingFeeRate(feeRate);
      
      // Wait 1 second before calculating (debounce)
      feeRateDebounceTimerRef.current = setTimeout(() => {
        // Don't set isPendingCalculation to false here - handleCalculate will do it
        // This prevents a gap where neither isPendingCalculation nor isCalculating is true
        handleCalculate();
      }, 1000);
    }
    
    // Cleanup function
    return () => {
      if (feeRateDebounceTimerRef.current) {
        clearTimeout(feeRateDebounceTimerRef.current);
      }
    };
  }, [walletAddress, compressedFile, feeRate, hasCalculated, isCalculating, calculationError]);

  const handleCalculate = async () => {
    if (!walletAddress || !compressedFile) return;

    // Capture the fee rate at the start of this calculation
    const calculationFeeRate = feeRate;
    
    // Create a new AbortController for this request
    abortControllerRef.current = new AbortController();
    
    // Set isCalculating and clear isPendingCalculation atomically
    setIsCalculating(true);
    setIsPendingCalculation(false);
    setCalculatingFeeRate(calculationFeeRate);
    setInscriptionData(null);

    try {
      const data = await createInscriptionCommit(
        compressedFile,
        walletAddress, // recipient
        calculationFeeRate,
        walletAddress,  // sender
        abortControllerRef.current.signal
      );

      // Only update state if the fee rate hasn't changed during the calculation
      if (currentFeeRateRef.current === calculationFeeRate) {
        setInscriptionData(data);
        setHasCalculated(true);
        setCalculationError(null); // Clear any previous errors on success
        hasShownErrorRef.current = false;
        needsRecalculationRef.current = false;
      } else {
        // Fee rate changed, ignore this stale result
        console.log('Ignoring stale calculation result - fee rate changed');
        // Don't mark as calculated so it will recalculate
        setHasCalculated(false);
      }
    } catch (error: any) {
      // Don't show error if request was aborted (user changed fee rate)
      if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
        console.log('Calculation aborted - fee rate changed');
        return;
      }
      
      // Only handle error if this calculation is still relevant
      if (currentFeeRateRef.current === calculationFeeRate) {
        const errorMessage = error.response?.data?.error || error.message || 'Failed to calculate inscription cost. Please try again.';
        console.error('Calculation failed:', error);
        
        // Set error state to prevent infinite retries
        setCalculationError(errorMessage);
        setHasCalculated(true); // Mark as calculated to prevent auto-retry
        
        // Only show alert once per error
        if (!hasShownErrorRef.current) {
          hasShownErrorRef.current = true;
          alert(errorMessage);
        }
      }
    } finally {
      setIsCalculating(false);
      
      // Only clear calculating state if the fee rate hasn't changed
      if (currentFeeRateRef.current === calculationFeeRate) {
        // Fee rate is still the same, clear calculating state
        setIsPendingCalculation(false);
        setCalculatingFeeRate(null);
      } else {
        // Fee rate changed, keep showing calculating state for the new rate
        // Don't clear isPendingCalculation or calculatingFeeRate
        setHasCalculated(false);
      }
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
    setCalculationError(null);
    hasShownErrorRef.current = false;
  };

  const handleFileSelect = (file: File) => {
    setOriginalFile(file);
    setCompressedFile(null);
    setInscriptionData(null);
    setTxid(null);
    setHasCalculated(false);
    setCalculationError(null);
    hasShownErrorRef.current = false;
  };

  const handleCompressedFile = (file: File, compressing: boolean) => {
    setCompressedFile(file);
    
    // Reset calculation when file changes
    if (!compressing) {
      setInscriptionData(null);
      setHasCalculated(false);
      setCalculationError(null);
      hasShownErrorRef.current = false;
    }
  };

  const handleMintSuccess = (transactionId: string) => {
    setTxid(transactionId);
  };

  const handleFeeRateChange = (rate: number) => {
    const minFeeRate = 0.13;
    const validatedRate = rate < minFeeRate ? minFeeRate : rate;
    setFeeRate(validatedRate);
    // Clear error when fee rate changes to allow retry
    setCalculationError(null);
    hasShownErrorRef.current = false;
    // hasCalculated will be reset by the useEffect
    // Note: We don't clear inscriptionData here to avoid flickering
    // It will be updated when the new calculation completes
  };

  const fileIsValid = compressedFile ? isFileSizeValid(compressedFile.size) : false;

  return (
    <>
      {/* Hero Section - Full width, outside main container */}
      <HeroSection />

      {/* Main Content */}
      <main className="min-h-screen p-6 md:p-12 relative z-10 bg-dark-gradient-fade">
        <div className="max-w-6xl mx-auto">
          {/* Main Content - Single Column */}
          <div className="max-w-3xl mx-auto space-y-6">
          <div id="wallet-connect-section">
            <WalletConnect 
              onConnect={handleWalletConnect}
              onDisconnect={handleWalletDisconnect}
            />
          </div>

          <AIInstructions />

          <FileUpload 
            onFileSelect={handleFileSelect}
          />

          <FileValidation
            originalFile={originalFile}
            onCompressedFile={handleCompressedFile}
          />

          <MintButton
            walletAddress={walletAddress}
            compressedFile={compressedFile}
            isFileSizeValid={fileIsValid}
            inscriptionData={inscriptionData}
            onMintSuccess={handleMintSuccess}
            isCalculating={isCalculating || isPendingCalculation}
            calculatingFeeRate={calculatingFeeRate}
            feeRate={feeRate}
            onFeeRateChange={handleFeeRateChange}
          />

          <SocialJoin />

            <StatusDisplay
              txid={txid}
            />
          </div>

        </div>
      </main>
    </>
  );
}
