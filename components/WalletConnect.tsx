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
    <div id="wallet-connect-section" className="degent-card">
      <h2 className="degent-title h2">
        <span className="icon-square">
          <i className="fas fa-wallet text-degent-green"></i>
        </span>
        <span>Connect Wallet</span>
      </h2>
      
      {!address ? (
        <div>
          <p className="text-degent-muted mb-4">
            Connect your UniSat wallet to start minting
          </p>
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="btn btn-flex btn-gradient btn-curtain w-full"
          >
            {isConnecting ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <i className="fas fa-link"></i>
                <span>Connect UniSat Wallet</span>
              </>
            )}
          </button>
          {error && (
            <div className="mt-4 p-3 bg-red-900/50 border border-red-500 rounded-degent-button text-red-200 text-sm">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <p className="label-icon">
              <i className="fas fa-check-circle text-degent-green"></i>
              Connected Address:
            </p>
            <p className="degent-field-bg text-degent-green text-sm">
            <i className="fas fa-wallet"></i>{address}
            </p>
          </div>
          <button
            onClick={handleDisconnect}
            className="w-full btn btn-flex btn-idle">
            <i className="fas fa-sign-out-alt mr-2"></i>
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
