'use client';

import { useState, useEffect } from 'react';
import { connectWallet, isWalletInstalled, getWalletAddress } from '@/lib/wallet';

interface WalletConnectProps {
  onConnect: (address: string) => void;
  onDisconnect: () => void;
}

export default function WalletConnect({ onConnect, onDisconnect }: WalletConnectProps) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if wallet is already connected
    const checkConnection = async () => {
      const addr = await getWalletAddress();
      if (addr) {
        setAddress(addr);
        onConnect(addr);
      }
    };
    checkConnection();
  }, [onConnect]);

  const handleConnect = async () => {
    if (!isWalletInstalled()) {
      setError('UniSat wallet not detected. Please install the UniSat browser extension.');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const addr = await connectWallet();
      setAddress(addr);
      onConnect(addr);
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (window.unisat && typeof window.unisat.disconnect === 'function') {
      try {
        await window.unisat.disconnect();
      } catch (err) {
        console.warn('Failed to disconnect UniSat wallet:', err);
      }
    } else {
      console.warn('No disconnect method found on UniSat wallet');
    }

    setAddress(null);
    onDisconnect();
  };

  return (
    <div className="rounded-degent-card border border-degent-border bg-degent-card/50 backdrop-blur-sm p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-3">
        <span className="bg-degent-green/10 border border-degent-green/20 icon-square p-3 rounded-degent-button">
          <i className="fas fa-link text-degent-green"></i>
        </span>
        Connect Wallet
      </h2>
      
      {!address ? (
        <div>
          <p className="text-degent-muted mb-4">
            Connect your UniSat wallet to start minting
          </p>
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="overflow-hidden group relative w-full bg-degent-gradient hover:bg-degent-gradient-hover text-degent-dark font-bold py-3 px-6 rounded-degent-button transition-all duration-200 shadow-lg shadow-degent-green/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span className="absolute inset-0 bg-degent-green translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)]" />

            {isConnecting ? (
              <>
                <i className="relative z-10 fas fa-spinner fa-spin"></i>
                <span className="relative z-10">Connecting...</span>
              </>
            ) : (
              <>
                <i className="relative z-10 fas fa-wallet"></i>
                <span className="relative z-10">Connect UniSat Wallet</span>
              </>
            )}
          </button>
          {error && (
            <div className="mt-4 p-3 bg-red-900/50 border border-red-500 rounded-degent-button text-red-200 text-sm">
              <i className="relative z-10 fas fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <p className="text-degent-muted text-md mb-3 flex items-center gap-2">
              <i className="relative z-10 fas fa-check-circle text-degent-green"></i>
              Connected Address:
            </p>
            <p className="bg-degent-input border border-degent-border break-all flex flex-row font-mono gap-2.5 items-center p-4 rounded-degent-button text-degent-green text-sm">
            <i className="relative z-10 fas fa-wallet"></i>{address}
            </p>
          </div>
          <button
            onClick={handleDisconnect}
            className="w-full bg-degent-input hover:bg-degent-border border border-degent-border text-white font-semibold py-3 px-6 rounded-degent-button transition-colors"
          >
            <i className="relative z-10 fas fa-sign-out-alt mr-2"></i>
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
