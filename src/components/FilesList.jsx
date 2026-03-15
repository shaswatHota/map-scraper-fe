import { useState, useEffect } from 'react';
import { Files, Download, RefreshCw } from 'lucide-react';

const API_BASE = 'http://localhost:8000';

export default function FilesList() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/files`);
      const data = await response.json();
      setFiles(data.files || []);
    } catch (err) {
      setError('Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleDownload = (filename) => {
    window.open(`${API_BASE}/download/${filename}`, '_blank');
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="border border-white/20 rounded-lg bg-black/50 backdrop-blur overflow-hidden sticky top-4">
      <div className="p-4 border-b border-white/20 flex items-center justify-between">
        <h3 className="font-bold flex items-center space-x-2">
          <Files className="w-5 h-5" />
          <span>CSV FILES</span>
        </h3>
        <button
          onClick={fetchFiles}
          disabled={loading}
          className="p-1.5 hover:bg-white/10 rounded transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="max-h-[600px] overflow-y-auto">
        {loading && (
          <div className="p-8 text-center text-white/50 text-sm">
            LOADING...
          </div>
        )}

        {error && (
          <div className="p-4 text-center text-red-400 text-xs">
            {error}
          </div>
        )}

        {!loading && !error && files.length === 0 && (
          <div className="p-8 text-center text-white/50 text-sm">
            NO FILES YET
          </div>
        )}

        {!loading && !error && files.length > 0 && (
          <div className="divide-y divide-white/10">
            {files.map((file, index) => (
              <div
                key={index}
                className="p-4 hover:bg-white/5 transition-colors group"
              >
                <div className="flex items-start justify-between space-x-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-mono truncate mb-1" title={file.filename}>
                      {file.filename}
                    </p>
                    <div className="flex items-center space-x-3 text-xs text-white/50">
                      <span>{formatBytes(file.size_bytes)}</span>
                      <span>•</span>
                      <span>{formatDate(file.created_at)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(file.filename)}
                    className="flex-shrink-0 p-2 hover:bg-white/10 rounded transition-colors opacity-0 group-hover:opacity-100"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {!loading && !error && files.length > 0 && (
        <div className="p-3 border-t border-white/20 bg-white/5 text-center text-xs text-white/50">
          TOTAL: {files.length} {files.length === 1 ? 'FILE' : 'FILES'}
        </div>
      )}
    </div>
  );
}
