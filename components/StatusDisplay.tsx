'use client';

interface StatusDisplayProps {
  txid: string | null;
}

export default function StatusDisplay({ 
  txid
}: StatusDisplayProps) {

  if (!txid) return null;

  return (
    <div id="transaction" className="degent-card">
      <div className="space-y-4">
        {txid && (
          <div>
            <h3 className="degent-title h3">
                <span className="icon-square"><i className="fa-solid fa-check text-degent-green"></i></span>
                Transaction Sent!
            </h3>
            <div>
              <p className="text-gray-400 text-sm mb-1">Transaction ID:</p>
              <p className="degent-field-bg">
                {txid}
              </p>
            </div>
            <p className="info-text"><i className="fa-circle-info fas text-[16px]"></i>Your inscription will be created once the transaction is confirmed on the blockchain.</p>
            <p className="text-gray-400 text-sm mt-3">
              <a href={`https://mempool.space/tx/${txid}`} target="_blank" rel="noopener noreferrer" className="text-degent-green hover:underline">View on Mempool</a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
