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
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">🔗 Connect Wallet</h2>
      
      {!address ? (
        <div>
          <p className="text-gray-300 mb-4">
            Connect your UniSat wallet to start minting
          </p>
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full bg-bitcoin hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isConnecting ? 'Connecting...' : 'Connect UniSat Wallet'}
          </button>
          {error && (
            <div className="mt-4 p-3 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm">
              {error}
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <p className="text-gray-400 text-sm mb-1">Connected Address:</p>
            <p className="text-white font-mono text-sm bg-gray-900 p-3 rounded break-all">
              {address}
            </p>
          </div>
          <button
            onClick={handleDisconnect}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
