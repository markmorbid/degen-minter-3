'use client';

export default function Footer() {
  return (
    <footer className="w-full bg-degent-darker pt-6 pb-6 border-t border-degent-border text-white">
      <div className="container mx-auto max-w-6xl flex justify-center items-center px-4">
        <p className="text-sm">
          Powered by <a href="https://skrybit.io" target="_blank" rel="noopener noreferrer" className="hover:text-degent-green transition-colors">Skrybit API</a> • <a href="https://unisat.io" target="_blank" rel="noopener noreferrer" className="hover:text-degent-green transition-colors">UniSat Wallet</a>
        </p>
      </div>
    </footer>
  );
}

