'use client';

interface StatusDisplayProps {
  txid: string | null;
}

export default function StatusDisplay({ 
  txid
}: StatusDisplayProps) {

  if (!txid) return null;

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="space-y-4">
        {txid && (
          <div>
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
