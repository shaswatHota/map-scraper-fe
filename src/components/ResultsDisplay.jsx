import { CheckCircle, Download, Database, FileText } from 'lucide-react';

const API_BASE = 'http://localhost:8000';

export default function ResultsDisplay({ results }) {
  const handleDownload = () => {
    window.open(`${API_BASE}/download/${results.csv_filename}`, '_blank');
  };

  return (
    <div className="mt-6 space-y-4">
      <div className="border border-green-500/50 rounded-lg p-6 bg-green-500/10 backdrop-blur">
        <div className="flex items-start space-x-3">
          <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-green-400 mb-2">SCRAPE COMPLETE</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-white/50">TOTAL SCRAPED:</span>
                <span className="font-bold">{results.total_scraped}</span>
              </div>
              {results.csv_filename && (
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="text-white/50">CSV FILE:</span>
                  <span className="font-mono text-xs">{results.csv_filename}</span>
                </div>
              )}
              {results.db_saved && (
                <>
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-white/50">DB SAVED:</span>
                    <span className="text-green-400">TRUE</span>
                  </div>
                  {results.db_table_name && (
                    <div className="flex justify-between items-center">
                      <span className="text-white/50">TABLE NAME:</span>
                      <span className="font-mono text-xs">{results.db_table_name}</span>
                    </div>
                  )}
                </>
              )}
            </div>

            {results.csv_filename && (
              <button
                onClick={handleDownload}
                className="mt-4 w-full bg-white/10 hover:bg-white/20 border border-white/30 text-white py-2 rounded transition-all flex items-center justify-center space-x-2 text-sm"
              >
                <Download className="w-4 h-4" />
                <span>DOWNLOAD CSV</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {results.data && results.data.length > 0 && (
        <div className="border border-white/20 rounded-lg bg-black/50 backdrop-blur overflow-hidden">
          <div className="p-4 border-b border-white/20">
            <h3 className="font-bold flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>SCRAPED DATA ({results.data.length} records)</span>
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/20 bg-white/5">
                  <th className="text-left p-3 text-white/50 font-bold">#</th>
                  <th className="text-left p-3 text-white/50 font-bold">NAME</th>
                  <th className="text-left p-3 text-white/50 font-bold">RATING</th>
                  <th className="text-left p-3 text-white/50 font-bold">REVIEWS</th>
                  <th className="text-left p-3 text-white/50 font-bold">ADDRESS</th>
                  <th className="text-left p-3 text-white/50 font-bold">OPENING</th>
                  <th className="text-left p-3 text-white/50 font-bold">PHONE</th>
                </tr>
              </thead>
              <tbody>
                {results.data.slice(0, 10).map((item, index) => (
                  <tr key={index} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="p-3 text-white/50">{index + 1}</td>
                    <td className="p-3 font-semibold">{item.name || '-'}</td>
                    <td className="p-3">{item.rating || '-'}</td>
                    <td className="p-3 text-white/70">{item.reviews || '-'}</td>
                    <td className="p-3 text-white/70 max-w-xs truncate">{item.address || '-'}</td>
                    <td className="p-3 text-white/70">{item.opening || '-'}</td>
                    <td className="p-3 text-white/70">{item.phone_no || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {results.data.length > 10 && (
            <div className="p-3 text-center text-xs text-white/50 border-t border-white/20 bg-white/5">
              Showing 10 of {results.data.length} records. Download CSV for full data.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
