import { useState } from 'react';
import Card from '../components/Card.jsx';
import { findCustomSlide, renameCustomSlide, deleteCustomSlide } from '../services/customSlides.js';
import { getAllSlides, updateSlideTitleInList, deleteSlideFromList } from '../services/slideList.js';

export default function CustomSlide({ slideId, onRedactChange, onNavigateHome }) {
  const meta = findCustomSlide(slideId) || getAllSlides().find(s => s.id === slideId);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(meta?.title || '');

  if (!meta) {
    return (
      <div className="slide-card">
        <div className="card-body">Custom slide not found.</div>
      </div>
    );
  }

  // Prefer computed num from slideList (stays in sync with sidebar)
  const num = getAllSlides().find(s => s.id === slideId)?.num || meta.num;

  function commitRename() {
    if (draft.trim()) {
      renameCustomSlide(slideId, draft);
      updateSlideTitleInList(slideId, draft);
    }
    setEditing(false);
  }

  function onDelete() {
    if (!confirm(`Delete custom slide "${meta.title}"? This also removes its blocks.`)) return;
    deleteSlideFromList(slideId);
    onNavigateHome?.();
  }

  return (
    <Card slideId={slideId} title={meta.title} num={num} onRedactChange={onRedactChange}>
      <div className="custom-slide-tools">
        {editing ? (
          <div className="custom-slide-rename">
            <input
              autoFocus
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') commitRename();
                if (e.key === 'Escape') setEditing(false);
              }}
            />
            <button className="custom-btn-ok" onClick={commitRename}>✓ Save</button>
            <button className="custom-btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        ) : (
          <>
            <button className="custom-btn-ghost" onClick={() => setEditing(true)}>✎ Rename slide</button>
            <button className="custom-btn-danger" onClick={onDelete}>🗑 Delete slide</button>
          </>
        )}
      </div>
      <p className="custom-slide-hint">
        This slide was created by breaking out a block. Add more modular blocks below from the toolbar,
        or paste a screenshot anywhere.
      </p>
    </Card>
  );
}
