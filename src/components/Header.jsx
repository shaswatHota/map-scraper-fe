import { Terminal } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-white/20 bg-black/50 backdrop-blur">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex items-center space-x-3">
          <Terminal className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              MAPS<span className="text-white/50">_</span>SCRAPER
            </h1>
            <p className="text-xs text-white/50 mt-1">
              {'>'} EXTRACT DATA FROM GOOGLE MAPS
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
