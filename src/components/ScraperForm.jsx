import { useState } from 'react';
import { Play, Database, Settings, Eye, EyeOff } from 'lucide-react';

const API_BASE = 'http://localhost:8000';

export default function ScraperForm({ onScrapeComplete, onError, onLoading }) {
  const [query, setQuery] = useState('');
  const [scrapeCount, setScrapeCount] = useState(10);
  const [useFull, setUseFull] = useState(false);
  const [saveToDb, setSaveToDb] = useState(false);
  const [headless, setHeadless] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [dbConfig, setDbConfig] = useState({
    host: 'localhost',
    user:'user',
    password:'password',
    database: 'mapScrape'
  });

  const [dbStructure, setDbStructure] = useState('single');
  const [tableAction, setTableAction] = useState('create_new');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      onError('Search query is required');
      return;
    }

    onLoading(true);

    const requestData = {
      query: query.trim(),
      scrape_count: useFull ? 'full' : parseInt(scrapeCount),
      headless: headless,
      save_to_db: saveToDb,
    };

    if (saveToDb) {
      requestData.db_config = dbConfig;
      requestData.db_structure = dbStructure;
      requestData.table_action = tableAction;
    }

    try {
      const response = await fetch(`${API_BASE}/scrape`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        onScrapeComplete(result);
      } else {
        onError(result.message || 'Scraping failed');
      }
    } catch (error) {
      onError(error.message || 'Network error occurred');
    } finally {
      onLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border border-white/20 rounded-lg p-6 bg-black/50 backdrop-blur">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold flex items-center space-x-2">
          <Play className="w-5 h-5" />
          <span>INITIATE SCRAPE</span>
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs text-white/70 mb-2">SEARCH QUERY *</label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., cafe near Mumbai"
            className="w-full bg-black border border-white/30 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-white transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-white/70 mb-2">RESULTS COUNT</label>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="number"
                value={scrapeCount}
                onChange={(e) => setScrapeCount(e.target.value)}
                disabled={useFull}
                min="1"
                className="w-full bg-black border border-white/30 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-white transition-colors disabled:opacity-50"
              />
            </div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useFull}
                onChange={(e) => setUseFull(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-xs text-white/70">FULL</span>
            </label>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4">
          <label className="flex items-center space-x-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={saveToDb}
              onChange={(e) => setSaveToDb(e.target.checked)}
              className="w-4 h-4"
            />
            <Database className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
            <span className="text-sm text-white/70 group-hover:text-white transition-colors">
              SAVE TO DATABASE
            </span>
          </label>

          {saveToDb && (
            <div className="mt-4 space-y-4 pl-7 border-l-2 border-white/20">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-white/50 mb-1">HOST</label>
                  <input
                    type="text"
                    value={dbConfig.host}
                    onChange={(e) => setDbConfig({ ...dbConfig, host: e.target.value })}
                    className="w-full bg-black border border-white/20 rounded px-3 py-2 text-xs focus:outline-none focus:border-white/40 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1">DATABASE</label>
                  <input
                    type="text"
                    value={dbConfig.database}
                    onChange={(e) => setDbConfig({ ...dbConfig, database: e.target.value })}
                    className="w-full bg-black border border-white/20 rounded px-3 py-2 text-xs focus:outline-none focus:border-white/40 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1">USER</label>
                  <input
                    type="text"
                    value={dbConfig.user}
                    onChange={(e) => setDbConfig({ ...dbConfig, user: e.target.value })}
                    className="w-full bg-black border border-white/20 rounded px-3 py-2 text-xs focus:outline-none focus:border-white/40 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1">PASSWORD</label>
                  <input
                    type="password"
                    value={dbConfig.password}
                    onChange={(e) => setDbConfig({ ...dbConfig, password: e.target.value })}
                    className="w-full bg-black border border-white/20 rounded px-3 py-2 text-xs focus:outline-none focus:border-white/40 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/50 mb-2">STRUCTURE</label>
                <div className="flex space-x-3">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="single"
                      checked={dbStructure === 'single'}
                      onChange={(e) => setDbStructure(e.target.value)}
                      className="w-3 h-3"
                    />
                    <span className="text-xs text-white/70">SINGLE</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="normalized"
                      checked={dbStructure === 'normalized'}
                      onChange={(e) => setDbStructure(e.target.value)}
                      className="w-3 h-3"
                    />
                    <span className="text-xs text-white/70">NORMALIZED</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/50 mb-2">TABLE ACTION</label>
                <div className="flex space-x-3">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="create_new"
                      checked={tableAction === 'create_new'}
                      onChange={(e) => setTableAction(e.target.value)}
                      className="w-3 h-3"
                    />
                    <span className="text-xs text-white/70">CREATE NEW</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="update_existing"
                      checked={tableAction === 'update_existing'}
                      onChange={(e) => setTableAction(e.target.value)}
                      className="w-3 h-3"
                    />
                    <span className="text-xs text-white/70">UPDATE EXISTING</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center space-x-2 text-xs text-white/50 hover:text-white/70 transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>DEVELOPER OPTIONS</span>
          </button>

          {showAdvanced && (
            <div className="mt-3 pl-6 border-l-2 border-white/20">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={headless}
                  onChange={(e) => setHeadless(e.target.checked)}
                  className="w-4 h-4"
                />
                {headless ? (
                  <EyeOff className="w-4 h-4 text-white/50" />
                ) : (
                  <Eye className="w-4 h-4 text-white/70" />
                )}
                <div>
                  <div className="text-xs text-white/70">RUN IN HEADLESS MODE</div>
                  <div className="text-xs text-white/40">Uncheck to see browser during scraping</div>
                </div>
              </label>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-white text-black font-bold py-3 rounded hover:bg-white/90 transition-all flex items-center justify-center space-x-2 group"
        >
          <Play className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          <span>EXECUTE SCRAPE</span>
        </button>
      </div>
    </form>
  );
}
