import { useEffect, useState } from 'react';
import { lsGet } from '../hooks/useLocalStorage.js';
import { getCurrentTemplateName } from '../services/templates.js';
import { computeDrift } from '../services/drift.js';

export default function TopBar({
  projectName,
  showRedacted,
  onToggleRedaction,
  onToggleAI,
  onToggleTemplates,
  onPrint,
  onOpenStatus,
  onPresent,
  onOpenDrift,
}) {
  const [templateName, setTemplateName] = useState(() => getCurrentTemplateName());
  const [driftCount, setDriftCount] = useState(0);

  // Make API key available globally (sourced from localStorage if a developer
  // wires it in elsewhere, e.g. server-injected before SSR or a backend proxy).
  useEffect(() => {
    window._apiKey = lsGet('apiKey', '');
  }, []);

  useEffect(() => {
    const refresh = () => {
      setTemplateName(getCurrentTemplateName());
      setDriftCount(computeDrift().totalChanges);
    };
    refresh();
    window.addEventListener('current-template-change', refresh);
    window.addEventListener('drift-state-change', refresh);
    const t = setInterval(refresh, 2500);
    return () => {
      window.removeEventListener('current-template-change', refresh);
      window.removeEventListener('drift-state-change', refresh);
      clearInterval(t);
    };
  }, []);

  return (
    <div className="topbar">
      <div className="logo">
        📊 Estimate Basis Builder <span>M&T</span>
      </div>
      <div className="project-name">
        {projectName || 'No Project Selected'}
        <button
          type="button"
          className={`template-tag${templateName ? '' : ' template-tag-none'}${driftCount > 0 ? ' template-tag-dirty' : ''}`}
          onClick={onOpenDrift}
          title="Click to see what's changed from the baseline"
        >
          <span>📑 {templateName || 'No template (default)'}</span>
          {driftCount > 0 ? (
            <span className="template-tag-changes">⚠ {driftCount} change{driftCount !== 1 ? 's' : ''}</span>
          ) : templateName ? (
            <span className="template-tag-clean">✓ clean</span>
          ) : null}
        </button>
      </div>
      <div className="controls">
        <button onClick={onToggleAI}>🤖 AI</button>
        <button onClick={onOpenStatus}>📊 Status</button>
        <button onClick={onPresent}>▶ Present</button>
        <button onClick={onToggleTemplates}>📑 Templates</button>
        <button
          className={`redact-toggle${showRedacted ? ' active' : ''}`}
          onClick={onToggleRedaction}
        >
          {showRedacted ? '🔓 Showing All' : '🔒 Show Redacted'}
        </button>
        <button onClick={onPrint}>📄 Print PDF</button>
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
