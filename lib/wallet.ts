// UniSat Wallet utility functions

declare global {
  interface Window {
    unisat?: {
      requestAccounts: () => Promise<string[]>;
      getAccounts: () => Promise<string[]>;
      sendBitcoin: (address: string, amount: number) => Promise<string>;
      disconnect?: () => Promise<void>;
      on: (event: string, handler: () => void) => void;
      removeListener: (event: string, handler: () => void) => void;
    };
  }
}

export const isWalletInstalled = (): boolean => {
  return typeof window !== 'undefined' && typeof window.unisat !== 'undefined';
};

export const connectWallet = async (): Promise<string> => {
  if (!isWalletInstalled()) {
    throw new Error('UniSat wallet not installed');
  }

  try {
    const accounts = await window.unisat!.requestAccounts();
    if (accounts.length === 0) {
      throw new Error('No accounts found');
    }
    return accounts[0];
  } catch (error) {
    console.error('Failed to connect wallet:', error);
    throw error;
  }
};

export const getWalletAddress = async (): Promise<string | null> => {
  if (!isWalletInstalled()) {
    return null;
  }

  try {
    const accounts = await window.unisat!.getAccounts();
    return accounts.length > 0 ? accounts[0] : null;
  } catch (error) {
    console.error('Failed to get wallet address:', error);
    return null;
  }
};

export const sendBitcoin = async (
  address: string,
  amountInSats: number
): Promise<string> => {
  if (!isWalletInstalled()) {
    throw new Error('UniSat wallet not installed');
  }

  try {
    // CRITICAL: Convert to integer to prevent "0.00000000 BTC" error
    const amount = parseInt(amountInSats.toString());
    
    // Validate the amount is a valid positive integer
    if (isNaN(amount) || amount <= 0) {
      throw new Error(
        `Invalid Bitcoin amount: ${amountInSats}. ` +
        'Amount must be a positive integer in satoshis.'
      );
    }

    console.log('UniSat sendBitcoin called with:', { address, amount });
    const txid = await window.unisat!.sendBitcoin(address, amount);
    console.log('Transaction successful:', txid);
    return txid;
  } catch (error) {
    console.error('Failed to send Bitcoin:', error);
    throw error;
  }
};
