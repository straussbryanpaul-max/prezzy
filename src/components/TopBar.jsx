import { useEffect, useState } from 'react';
import { lsGet, lsSet } from '../hooks/useLocalStorage.js';

export default function TopBar({
  projectName,
  showRedacted,
  onToggleRedaction,
  onToggleAI,
  onToggleTemplates,
}) {
  const [apiKey, setApiKey] = useState(() => lsGet('apiKey', ''));

  useEffect(() => {
    window._apiKey = apiKey;
  }, [apiKey]);

  function onApiKeyChange(v) {
    setApiKey(v);
    lsSet('apiKey', v);
  }

  return (
    <div className="topbar">
      <div className="logo">
        📊 Estimate Basis Builder <span>M&T</span>
      </div>
      <div className="project-name">{projectName || 'No Project Selected'}</div>
      <div className="controls">
        <div className="api-wrap">
          <div className={`api-dot${apiKey.length > 20 ? ' on' : ''}`} />
          <input
            className="api-key-input"
            type="password"
            placeholder="sk-ant-... API key"
            value={apiKey}
            onChange={e => onApiKeyChange(e.target.value)}
          />
        </div>
        <button onClick={onToggleAI}>🤖 AI</button>
        <button onClick={onToggleTemplates}>📑 Templates</button>
        <button
          className={`redact-toggle${showRedacted ? ' active' : ''}`}
          onClick={onToggleRedaction}
        >
          {showRedacted ? '🔓 Showing All' : '🔒 Show Redacted'}
        </button>
        <button onClick={() => window.print()}>📄 Print PDF</button>
        <button
          onClick={() =>
            alert('PPTX export requires pptxgenjs integration. Save your work and use the export API.')
          }
        >
          📊 Export PPTX
        </button>
      </div>
    </div>
  );
}
