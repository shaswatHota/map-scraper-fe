import { useState, useEffect } from 'react';
import ScraperForm from './components/ScraperForm';
import ResultsDisplay from './components/ResultsDisplay';
import FilesList from './components/FilesList';
import Header from './components/Header';

function App() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshFiles, setRefreshFiles] = useState(0);

  const handleScrapeComplete = (data) => {
    setResults(data);
    setRefreshFiles(prev => prev + 1);
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  const handleLoading = (isLoading) => {
    setLoading(isLoading);
    if (isLoading) {
      setError(null);
      setResults(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <div className="binary-bg"></div>

      <div className="relative z-10">
        <Header />

        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ScraperForm
                onScrapeComplete={handleScrapeComplete}
                onError={handleError}
                onLoading={handleLoading}
              />

              {loading && (
                <div className="mt-6 border border-white/20 rounded-lg p-8 bg-black/50 backdrop-blur">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="binary-loader"></div>
                    <p className="text-white/70 text-sm">SCRAPING IN PROGRESS...</p>
                    <p className="text-white/50 text-xs">This may take a few minutes</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-6 border border-red-500/50 rounded-lg p-4 bg-red-500/10 backdrop-blur">
                  <p className="text-red-400 text-sm">ERROR: {error}</p>
                </div>
              )}

              {results && <ResultsDisplay results={results} />}
            </div>

            <div className="lg:col-span-1">
              <FilesList key={refreshFiles} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
