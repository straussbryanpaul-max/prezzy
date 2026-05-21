import { useEffect, useState } from 'react';
import { computeDrift } from '../services/drift.js';

export default function DriftView({ open, onClose, onNavigate }) {
  const [data, setData] = useState(() => computeDrift());

  useEffect(() => {
    if (!open) return;
    setData(computeDrift());
    const handler = () => setData(computeDrift());
    window.addEventListener('drift-state-change', handler);
    window.addEventListener('current-template-change', handler);
    return () => {
      window.removeEventListener('drift-state-change', handler);
      window.removeEventListener('current-template-change', handler);
    };
  }, [open]);

  if (!open) return null;

  const name = data.templateName || '(no template — using default starting state)';

  return (
    <div className="modal-bg open" onClick={onClose}>
      <div className="modal drift-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-hdr">
          <h3>📑 Template Drift</h3>
          <button className="modal-x" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="drift-banner">
            <div className="drift-banner-tpl">
              <span className="drift-banner-label">Baseline template:</span>
              <strong>{name}</strong>
            </div>
            <div className="drift-banner-count">
              {data.totalChanges === 0 ? (
                <span className="drift-clean">✓ No changes from baseline</span>
              ) : (
                <span className="drift-dirty">⚠ {data.totalChanges} change{data.totalChanges !== 1 ? 's' : ''}</span>
              )}
            </div>
          </div>

          {data.addedSecDels.length > 0 && (
            <div className="drift-section">
              <h4>🗑 Sections removed since baseline ({data.addedSecDels.length})</h4>
              <ul>
                {data.addedSecDels.map(d => (
                  <li key={d.id} onClick={() => { onNavigate?.(d.id); onClose(); }}>
                    <span className="drift-sec">{d.section}</span>
                    <span className="drift-name">{d.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.addedChunkDels.length > 0 && (
            <div className="drift-section">
              <h4>🗑 Elements removed from slides ({data.addedChunkDels.length})</h4>
              <ul>
                {data.addedChunkDels.map(d => (
                  <li key={d.id}>
                    <span className="drift-name">{d.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.addedCustom.length > 0 && (
            <div className="drift-section">
              <h4>✨ Custom slides added ({data.addedCustom.length})</h4>
              <ul>
                {data.addedCustom.map(d => (
                  <li key={d.id} onClick={() => { onNavigate?.(d.id); onClose(); }}>
                    <span className="drift-name">{d.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.removedCustom.length > 0 && (
            <div className="drift-section">
              <h4>❌ Custom slides removed since baseline ({data.removedCustom.length})</h4>
              <ul>
                {data.removedCustom.map(d => (
                  <li key={d.id}>
                    <span className="drift-name">{d.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.restoredSecDels.length > 0 && (
            <div className="drift-section">
              <h4>↩ Sections restored from baseline ({data.restoredSecDels.length})</h4>
              <ul>
                {data.restoredSecDels.map(d => (
                  <li key={d.id} onClick={() => { onNavigate?.(d.id); onClose(); }}>
                    <span className="drift-name">{d.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.totalChanges === 0 && (
            <div className="drift-empty">
              This package matches the {data.hasTemplate ? 'loaded template' : 'default starting state'} exactly.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
