import { useState } from 'react';
import {
  listTemplates,
  saveTemplate,
  loadTemplate,
  deleteTemplate,
  renameTemplate,
  resetToBlank,
  templateSizeKB,
} from '../services/templates.js';

function fmtDate(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function TemplateManager({ open, onClose, onStatus }) {
  const [name, setName] = useState('');
  const [templates, setTemplates] = useState(() => listTemplates());
  const [renaming, setRenaming] = useState(null); // { oldName, newName }

  function refresh() {
    setTemplates(listTemplates());
  }

  function onSave() {
    const trimmed = name.trim();
    if (!trimmed) {
      alert('Enter a name for this template.');
      return;
    }
    if (templates[trimmed]) {
      if (!confirm(`Overwrite existing template "${trimmed}"?`)) return;
    }
    try {
      saveTemplate(trimmed);
      setName('');
      refresh();
      onStatus?.(`Template "${trimmed}" saved ✓`);
    } catch (e) {
      alert('Save failed: ' + e.message);
    }
  }

  function onLoad(tplName) {
    if (!confirm(`Load template "${tplName}"? This will replace your current work.\n\n(Tip: save the current state as a template first if you want to keep it.)`)) {
      return;
    }
    try {
      loadTemplate(tplName);
      onStatus?.(`Template "${tplName}" loaded — reloading...`);
      setTimeout(() => window.location.reload(), 400);
    } catch (e) {
      alert('Load failed: ' + e.message);
    }
  }

  function onDelete(tplName) {
    if (!confirm(`Delete template "${tplName}"? This cannot be undone.`)) return;
    deleteTemplate(tplName);
    refresh();
    onStatus?.(`Template "${tplName}" deleted`);
  }

  function onRename(oldName) {
    setRenaming({ oldName, newName: oldName });
  }

  function commitRename() {
    if (!renaming) return;
    try {
      renameTemplate(renaming.oldName, renaming.newName);
      setRenaming(null);
      refresh();
      onStatus?.('Template renamed');
    } catch (e) {
      alert(e.message);
    }
  }

  function onReset() {
    if (!confirm('Reset everything to a blank starting state? This clears all current work.\n\n(Save as a template first if you want to keep it.)')) {
      return;
    }
    resetToBlank();
    onStatus?.('Reset to blank — reloading...');
    setTimeout(() => window.location.reload(), 400);
  }

  if (!open) return null;

  const entries = Object.entries(templates).sort(
    ([, a], [, b]) => (b.updated || b.created || 0) - (a.updated || a.created || 0)
  );

  return (
    <div className="modal-bg open" onClick={onClose}>
      <div className="modal tpl-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-hdr">
          <h3>📑 Templates</h3>
          <button className="modal-x" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="tpl-section">
            <label className="tpl-label">Save current as new template</label>
            <div className="tpl-save-row">
              <input
                type="text"
                placeholder="e.g. Standard Data Center BOE"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && onSave()}
              />
              <button className="tpl-btn-primary" onClick={onSave}>💾 Save</button>
            </div>
            <p className="tpl-help">
              Captures every customization on every slide — deletions, resizes, modular blocks,
              form values, notes, images — except your API key and UI preferences.
            </p>
          </div>

          <div className="tpl-section">
            <label className="tpl-label">Saved templates ({entries.length})</label>
            {entries.length === 0 ? (
              <div className="tpl-empty">No templates saved yet.</div>
            ) : (
              <div className="tpl-list">
                {entries.map(([tplName, t]) => (
                  <div key={tplName} className="tpl-row">
                    <div className="tpl-row-info">
                      {renaming?.oldName === tplName ? (
                        <input
                          type="text"
                          value={renaming.newName}
                          onChange={e => setRenaming({ ...renaming, newName: e.target.value })}
                          onKeyDown={e => {
                            if (e.key === 'Enter') commitRename();
                            if (e.key === 'Escape') setRenaming(null);
                          }}
                          autoFocus
                          className="tpl-rename-input"
                        />
                      ) : (
                        <div className="tpl-row-name">{tplName}</div>
                      )}
                      <div className="tpl-row-meta">
                        {fmtDate(t.updated || t.created)} · ~{templateSizeKB(t)} KB
                      </div>
                    </div>
                    <div className="tpl-row-actions">
                      {renaming?.oldName === tplName ? (
                        <>
                          <button className="tpl-btn-ok" onClick={commitRename}>✓</button>
                          <button className="tpl-btn-ghost" onClick={() => setRenaming(null)}>✕</button>
                        </>
                      ) : (
                        <>
                          <button className="tpl-btn-primary" onClick={() => onLoad(tplName)}>↓ Load</button>
                          <button className="tpl-btn-ghost" onClick={() => onRename(tplName)} title="Rename">✎</button>
                          <button className="tpl-btn-danger" onClick={() => onDelete(tplName)} title="Delete">🗑</button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="tpl-section tpl-danger-section">
            <label className="tpl-label">Start over</label>
            <button className="tpl-btn-danger-full" onClick={onReset}>
              ⚠ Reset everything to blank
            </button>
            <p className="tpl-help">
              Wipes all current work and starts from a clean template. Save first if you want to keep what you have.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
