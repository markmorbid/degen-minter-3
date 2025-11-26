'use client';

interface StatusDisplayProps {
  txid: string | null;
}

export default function StatusDisplay({ 
  txid
}: StatusDisplayProps) {

  if (!txid) return null;

  return (
    <div className="rounded-degent-card border border-degent-green/50 bg-degent-card/50 backdrop-blur-sm p-6 shadow-lg shadow-degent-green/20">
      <div className="space-y-4">
        {txid && (
          <div>
            <h3 className="text-white font-semibold mb-2 flex items-center gap-3">
              <span className="p-2 bg-degent-green/20 rounded-degent-button">
                <i className="fas fa-check-circle text-degent-green"></i>
              </span>
              Transaction Sent!
            </h3>
            <div>
              <p className="text-degent-muted text-sm mb-1 flex items-center gap-2">
                <i className="fas fa-hashtag"></i>
                Transaction ID:
              </p>
              <p className="text-degent-green font-mono text-xs bg-degent-input border border-degent-border p-2 rounded-degent-button break-all">
                {txid}
              </p>
            </div>
            <p className="text-degent-muted text-sm mt-3 flex items-center gap-2">
              <i className="fas fa-info-circle"></i>
              Your inscription will be created once the transaction is confirmed on the blockchain.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
