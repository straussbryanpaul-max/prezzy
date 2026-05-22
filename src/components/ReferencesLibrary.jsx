import { useMemo, useState } from 'react';
import { useAllReferences } from '../hooks/useReferences.js';
import {
  removeReference,
  bulkAddManualReferences,
} from '../services/references.js';
import { sections, allSlides } from '../data/sections.js';
import { getCustomSlides } from '../services/customSlides.js';
import { blockSummary } from '../services/referenceFormat.js';

function fmtDate(ms) {
  try {
    return new Date(ms).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

function useSlideOptions() {
  return useMemo(() => {
    const custom = getCustomSlides().map(s => ({ id: s.id, label: s.title, num: s.num }));
    const baseline = allSlides.map(s => ({ id: s.id, label: s.title, num: s.num }));
    return [...baseline, ...custom];
  }, []);
}

function slideLabelFor(slideId, options) {
  const o = options.find(s => s.id === slideId);
  return o ? `${o.num} — ${o.label}` : slideId;
}

function BulkAddForm({ slideOptions, onAdded, onStatus }) {
  const [open, setOpen] = useState(false);
  const [slideId, setSlideId] = useState(slideOptions[0]?.id || '');
  const [source, setSource] = useState('');
  const [raw, setRaw] = useState('');

  function reset() {
    setSlideId(slideOptions[0]?.id || '');
    setSource('');
    setRaw('');
    setOpen(false);
  }

  function submit() {
    if (!slideId) {
      alert('Pick a slide.');
      return;
    }
    if (!raw.trim()) {
      alert('Paste some text first.');
      return;
    }

    // Parse: split on blank lines. First line of each chunk is the label,
    // remaining lines are the body. If a chunk is one line, label = first
    // 60 chars + body is the whole thing.
    const chunks = raw
      .split(/\n\s*\n/)
      .map(s => s.trim())
      .filter(Boolean);

    const entries = chunks.map(chunk => {
      const lines = chunk.split('\n');
      if (lines.length === 1) {
        const single = lines[0];
        return {
          slideId,
          label: single.length > 60 ? single.slice(0, 60) + '…' : single,
          source,
          text: single,
        };
      }
      return {
        slideId,
        label: lines[0].trim(),
        source,
        text: lines.slice(1).join('\n').trim(),
      };
    });

    const added = bulkAddManualReferences(entries);
    onAdded?.(added);
    onStatus?.(`✓ Added ${added} reference${added !== 1 ? 's' : ''}`);
    reset();
  }

  if (!open) {
    return (
      <button className="refs-add-toggle refs-bulk-toggle" onClick={() => setOpen(true)}>
        + Bulk add references (paste a batch)
      </button>
    );
  }

  return (
    <div className="refs-add-form refs-bulk-form">
      <div className="refs-bulk-help">
        Paste multiple examples separated by a blank line. The first line of
        each block is the title, the rest is the body.
      </div>
      <label className="refs-field-label">Slide</label>
      <select
        value={slideId}
        onChange={e => setSlideId(e.target.value)}
        className="refs-input"
      >
        {slideOptions.map(o => (
          <option key={o.id} value={o.id}>
            {o.num} — {o.label}
          </option>
        ))}
      </select>
      <label className="refs-field-label">Source (applies to all)</label>
      <input
        type="text"
        placeholder="e.g. '2024 Refinery A estimate'"
        value={source}
        onChange={e => setSource(e.target.value)}
        className="refs-input"
      />
      <label className="refs-field-label">Examples</label>
      <textarea
        placeholder={
          'Example 1 title\nBody of example 1...\n\nExample 2 title\nBody of example 2...'
        }
        value={raw}
        onChange={e => setRaw(e.target.value)}
        rows={10}
        className="refs-textarea"
      />
      <div className="refs-add-actions">
        <button className="refs-btn-secondary" onClick={reset}>Cancel</button>
        <button className="refs-btn-primary" onClick={submit}>Add all</button>
      </div>
    </div>
  );
}

export default function ReferencesLibrary({ open, onClose, onStatus, onNavigate }) {
  const refs = useAllReferences();
  const slideOptions = useSlideOptions();

  const [slideFilter, setSlideFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [kindFilter, setKindFilter] = useState('');

  const sources = useMemo(() => {
    const s = new Set();
    refs.forEach(r => r.source && s.add(r.source));
    return Array.from(s).sort();
  }, [refs]);

  const filtered = useMemo(() => {
    return refs
      .filter(r => !slideFilter || r.slideId === slideFilter)
      .filter(r => !sourceFilter || r.source === sourceFilter)
      .filter(r => !kindFilter || r.kind === kindFilter)
      .sort((a, b) => b.savedAt - a.savedAt);
  }, [refs, slideFilter, sourceFilter, kindFilter]);

  if (!open) return null;

  function onDelete(id) {
    if (!confirm('Delete this reference?')) return;
    removeReference(id);
    onStatus?.('Reference deleted');
  }

  function goToSlide(slideId) {
    onNavigate?.(slideId);
    onClose();
  }

  return (
    <div className="modal-bg open" onClick={onClose}>
      <div className="modal refs-library-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-hdr">
          <h3>📚 References Library</h3>
          <button className="modal-x" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="refs-lib-summary">
            {refs.length} reference{refs.length !== 1 ? 's' : ''} across the library
          </div>

          <BulkAddForm
            slideOptions={slideOptions}
            onAdded={() => { /* live-updates via hook */ }}
            onStatus={onStatus}
          />

          <div className="refs-lib-filters">
            <select
              value={slideFilter}
              onChange={e => setSlideFilter(e.target.value)}
              className="refs-input"
            >
              <option value="">All slides</option>
              {slideOptions.map(o => (
                <option key={o.id} value={o.id}>{o.num} — {o.label}</option>
              ))}
            </select>
            <select
              value={sourceFilter}
              onChange={e => setSourceFilter(e.target.value)}
              className="refs-input"
            >
              <option value="">All sources</option>
              {sources.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select
              value={kindFilter}
              onChange={e => setKindFilter(e.target.value)}
              className="refs-input"
            >
              <option value="">All kinds</option>
              <option value="deck">From saved decks</option>
              <option value="manual">Manual entries</option>
            </select>
          </div>

          {filtered.length === 0 && (
            <div className="refs-empty">No references match these filters.</div>
          )}

          <div className="refs-lib-list">
            {filtered.map(r => (
              <div key={r.id} className="refs-lib-row">
                <div className="refs-lib-row-main">
                  <div className="refs-lib-row-hdr">
                    <span className={`refs-kind refs-kind-${r.kind}`}>
                      {r.kind === 'deck' ? 'DECK' : 'MANUAL'}
                    </span>
                    <span className="refs-lib-label">{r.label}</span>
                  </div>
                  <div className="refs-lib-row-meta">
                    <button
                      className="refs-lib-slide-link"
                      onClick={() => goToSlide(r.slideId)}
                      title="Jump to this slide"
                    >
                      {slideLabelFor(r.slideId, slideOptions)}
                    </button>
                    {r.source && <span>• {r.source}</span>}
                    <span>• {fmtDate(r.savedAt)}</span>
                    {r.kind === 'deck' && (
                      <span>• {r.blocks?.length || 0} block{(r.blocks?.length || 0) !== 1 ? 's' : ''}</span>
                    )}
                  </div>
                  {r.kind === 'manual' && r.text && (
                    <div className="refs-lib-preview">
                      {r.text.length > 200 ? r.text.slice(0, 200) + '…' : r.text}
                    </div>
                  )}
                  {r.kind === 'deck' && r.blocks?.length > 0 && (
                    <div className="refs-lib-preview">
                      {r.blocks.slice(0, 3).map(b => blockSummary(b)).join(' · ')}
                      {r.blocks.length > 3 && ` · +${r.blocks.length - 3} more`}
                    </div>
                  )}
                </div>
                <button
                  className="refs-card-del"
                  onClick={() => onDelete(r.id)}
                  title="Delete reference"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
