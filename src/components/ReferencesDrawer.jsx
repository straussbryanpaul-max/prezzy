import { useState } from 'react';
import { useReferences } from '../hooks/useReferences.js';
import { blockToText, blockSummary } from '../services/referenceFormat.js';

function fmtDate(ms) {
  try {
    return new Date(ms).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

async function copyToClipboard(text, onStatus) {
  try {
    await navigator.clipboard.writeText(text);
    onStatus?.('✓ Copied to clipboard');
  } catch {
    // Fallback for older browsers
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      onStatus?.('✓ Copied to clipboard');
    } catch {
      onStatus?.('Copy failed — select text manually', 'var(--red)');
    }
    document.body.removeChild(ta);
  }
}

function ManualEntryForm({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState('');
  const [source, setSource] = useState('');
  const [text, setText] = useState('');

  function reset() {
    setLabel('');
    setSource('');
    setText('');
    setOpen(false);
  }

  function submit() {
    if (!text.trim()) {
      alert('Please paste in some reference text.');
      return;
    }
    onAdd({ label, source, text });
    reset();
  }

  if (!open) {
    return (
      <button className="refs-add-toggle" onClick={() => setOpen(true)}>
        + Add manual reference
      </button>
    );
  }

  return (
    <div className="refs-add-form">
      <input
        type="text"
        placeholder="Title (e.g. 'Refinery A safety moment')"
        value={label}
        onChange={e => setLabel(e.target.value)}
        className="refs-input"
      />
      <input
        type="text"
        placeholder="Source (e.g. '2024 Refinery A estimate')"
        value={source}
        onChange={e => setSource(e.target.value)}
        className="refs-input"
      />
      <textarea
        placeholder="Paste reference text here..."
        value={text}
        onChange={e => setText(e.target.value)}
        rows={6}
        className="refs-textarea"
      />
      <div className="refs-add-actions">
        <button className="refs-btn-secondary" onClick={reset}>Cancel</button>
        <button className="refs-btn-primary" onClick={submit}>Save reference</button>
      </div>
    </div>
  );
}

function DeckReferenceCard({ entry, onCopy, onDelete }) {
  const blocks = entry.blocks || [];
  const fullText = blocks.map(blockToText).filter(Boolean).join('\n\n');

  return (
    <div className="refs-card">
      <div className="refs-card-hdr">
        <div className="refs-card-title">
          <span className="refs-kind refs-kind-deck">DECK</span>
          {entry.label}
        </div>
        <button className="refs-card-del" onClick={() => onDelete(entry.id)} title="Delete">✕</button>
      </div>
      <div className="refs-card-meta">
        {entry.source && <span>{entry.source}</span>}
        <span>{fmtDate(entry.savedAt)}</span>
        <span>{blocks.length} block{blocks.length !== 1 ? 's' : ''}</span>
      </div>

      {blocks.length === 0 && (
        <div className="refs-card-empty">(No blocks were saved for this slide)</div>
      )}

      {blocks.map((b, i) => {
        const text = blockToText(b);
        const summary = blockSummary(b);
        return (
          <div key={b.id || i} className="refs-block-row">
            <div className="refs-block-info">
              <span className="refs-block-type">{b.type}</span>
              <span className="refs-block-summary">{summary}</span>
            </div>
            {text ? (
              <button className="refs-copy-btn" onClick={() => onCopy(text)}>Copy</button>
            ) : (
              <span className="refs-copy-na">—</span>
            )}
          </div>
        );
      })}

      {blocks.length > 1 && fullText && (
        <button className="refs-copy-all" onClick={() => onCopy(fullText)}>Copy all blocks</button>
      )}
    </div>
  );
}

function ManualReferenceCard({ entry, onCopy, onDelete }) {
  return (
    <div className="refs-card">
      <div className="refs-card-hdr">
        <div className="refs-card-title">
          <span className="refs-kind refs-kind-manual">MANUAL</span>
          {entry.label}
        </div>
        <button className="refs-card-del" onClick={() => onDelete(entry.id)} title="Delete">✕</button>
      </div>
      <div className="refs-card-meta">
        {entry.source && <span>{entry.source}</span>}
        <span>{fmtDate(entry.savedAt)}</span>
      </div>
      <pre className="refs-manual-text">{entry.text}</pre>
      <button className="refs-copy-all" onClick={() => onCopy(entry.text)}>Copy text</button>
    </div>
  );
}

export default function ReferencesDrawer({ open, onClose, slideId, slideTitle, onStatus }) {
  const { references, add, remove } = useReferences(slideId);

  function onCopy(text) {
    copyToClipboard(text, onStatus);
  }

  function onDelete(id) {
    if (!confirm('Delete this reference?')) return;
    remove(id);
    onStatus?.('Reference deleted');
  }

  return (
    <div className={`refs-drawer${open ? ' open' : ''}`}>
      <div className="refs-hdr">
        <span style={{ fontSize: 16 }}>🗂</span>
        <span className="refs-hdr-title">Past Examples</span>
        <button className="refs-close" onClick={onClose}>✕</button>
      </div>
      <div className="refs-subhdr">
        For slide: <strong>{slideTitle || slideId}</strong>
      </div>
      <div className="refs-body">
        <ManualEntryForm
          onAdd={data => {
            add(data);
            onStatus?.('✓ Reference saved');
          }}
        />

        {references.length === 0 && (
          <div className="refs-empty">
            No references yet for this slide.
            <br />
            <span style={{ opacity: 0.6 }}>
              Add one above, or save a finished deck from the top bar to seed examples.
            </span>
          </div>
        )}

        {references.map(r =>
          r.kind === 'deck' ? (
            <DeckReferenceCard key={r.id} entry={r} onCopy={onCopy} onDelete={onDelete} />
          ) : (
            <ManualReferenceCard key={r.id} entry={r} onCopy={onCopy} onDelete={onDelete} />
          )
        )}
      </div>
    </div>
  );
}
