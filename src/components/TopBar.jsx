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
  onToggleRefs,
  onOpenLibrary,
  onSaveDeck,
}) {
  const [templateName, setTemplateName] = useState(() => getCurrentTemplateName());
  const [driftCount, setDriftCount] = useState(0);

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

      {/* ── LEFT: branding ── */}
      <div className="topbar-logo">
        <span className="topbar-logo-icon">📊</span>
        <span className="topbar-logo-name">Estimate Basis Builder</span>
        <span className="topbar-badge">M&amp;T</span>
      </div>

      {/* ── MIDDLE: project identity ── */}
      <div className="topbar-identity">
        <span className="topbar-project">{projectName || 'No Project Selected'}</span>
        <button
          className={`template-tag${templateName ? '' : ' template-tag-none'}${driftCount > 0 ? ' template-tag-dirty' : ''}`}
          onClick={onOpenDrift}
          title="Click to see what's changed from the baseline"
        >
          <span>📑 {templateName || 'No template'}</span>
          {driftCount > 0 ? (
            <span className="template-tag-changes">⚠ {driftCount}</span>
          ) : templateName ? (
            <span className="template-tag-clean">✓</span>
          ) : null}
        </button>
      </div>

      {/* ── RIGHT: actions ── */}
      <div className="topbar-actions">

        {/* Explore */}
        <div className="tb-group">
          <button className="tb-btn" onClick={onToggleAI} title="AI Assistant">🤖 AI</button>
          <button className="tb-btn" onClick={onOpenStatus} title="Project Status">📊 Status</button>
        </div>

        <div className="tb-sep" />

        {/* Present — primary CTA */}
        <button className="tb-btn tb-primary" onClick={onPresent}>▶ Present</button>

        <div className="tb-sep" />

        {/* Template & reference tools */}
        <div className="tb-group">
          <button className="tb-btn" onClick={onToggleTemplates} title="Templates">📑 Templates</button>
          <button className="tb-btn" onClick={onToggleRefs} title="Slide references">🗂 Refs</button>
          <button className="tb-btn" onClick={onOpenLibrary} title="Full reference library">📚 Library</button>
          <button className="tb-btn" onClick={onSaveDeck} title="Save deck to library">💾 Save</button>
        </div>

        <div className="tb-sep" />

        {/* Output */}
        <div className="tb-group">
          <button
            className={`tb-btn tb-redact${showRedacted ? ' active' : ''}`}
            onClick={onToggleRedaction}
            title={showRedacted ? 'Showing all fields' : 'Showing redacted view'}
          >
            {showRedacted ? '🔓 Unredacted' : '🔒 Redacted'}
          </button>
          <button className="tb-btn" onClick={onPrint} title="Print to PDF">📄 Print</button>
        </div>

      </div>
    </div>
  );
}
