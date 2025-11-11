'use client';

interface StatusDisplayProps {
  txid: string | null;
  feeRate: number;
  onFeeRateChange: (rate: number) => void;
}

export default function StatusDisplay({ 
  txid, 
  feeRate, 
  onFeeRateChange 
}: StatusDisplayProps) {
  const handleFeeRateChange = (value: number) => {
    // Enforce minimum of 0.1 sats/vb
    if (value < 0.1) {
      onFeeRateChange(0.1);
    } else {
      onFeeRateChange(value);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">⚙️ Settings</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-gray-400 text-sm mb-2">
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
            className="w-full bg-gray-900 text-white px-4 py-2 rounded border border-gray-700 focus:border-bitcoin focus:outline-none"
          />
          <p className="text-gray-500 text-xs mt-1">
            Higher fee rates result in faster confirmation times (minimum: 0.1 sat/vb)
          </p>
        </div>

        {txid && (
          <div className="pt-4 border-t border-gray-700">
            <h3 className="text-white font-semibold mb-2">✅ Transaction Sent!</h3>
            <div>
              <p className="text-gray-400 text-sm mb-1">Transaction ID:</p>
              <p className="text-green-400 font-mono text-xs bg-gray-900 p-2 rounded break-all">
                {txid}
              </p>
            </div>
            <p className="text-gray-400 text-sm mt-3">
              Your inscription will be created once the transaction is confirmed on the blockchain.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
