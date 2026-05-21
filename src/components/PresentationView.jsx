import { useEffect, useState } from 'react';
import { allSlides } from '../data/sections.js';
import { lsGet } from '../hooks/useLocalStorage.js';
import SlideRouter from '../slides/index.jsx';
import { useBlocks } from '../hooks/useBlocks.js';
import BlockContainer from './blocks/BlockContainer.jsx';

function isSlideRedacted(sl) {
  return sl.redacted || lsGet('redact_' + sl.id, '') === 'true';
}

function PresentationSlide({ slideId }) {
  const { blocks } = useBlocks(slideId);
  return (
    <>
      <SlideRouter slideId={slideId} onRedactChange={() => {}} />
      <BlockContainer
        blocks={blocks}
        onUpdate={() => {}}
        onDelete={() => {}}
        onResize={() => {}}
        onReorder={() => {}}
      />
    </>
  );
}

export default function PresentationView({ initialSlideId, showRedacted, onExit }) {
  // Build the visible list (skip fully-redacted when not showing)
  const visibleSlides = allSlides.filter(sl => showRedacted || !isSlideRedacted(sl));
  const initialIdx = Math.max(0, visibleSlides.findIndex(s => s.id === initialSlideId));
  const [idx, setIdx] = useState(initialIdx);
  const current = visibleSlides[idx] || visibleSlides[0];

  function next() {
    setIdx(i => Math.min(i + 1, visibleSlides.length - 1));
  }
  function prev() {
    setIdx(i => Math.max(i - 1, 0));
  }

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') {
        onExit();
      } else if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prev();
      } else if (e.key === 'Home') {
        setIdx(0);
      } else if (e.key === 'End') {
        setIdx(visibleSlides.length - 1);
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleSlides.length]);

  useEffect(() => {
    document.body.classList.add('presentation-mode');
    return () => document.body.classList.remove('presentation-mode');
  }, []);

  if (!current) return null;

  return (
    <div className="presentation-root">
      <div className="presentation-stage">
        <div className="presentation-slide-wrap">
          <PresentationSlide slideId={current.id} />
        </div>
      </div>

      <div className="presentation-controls">
        <button className="pres-ctl-btn" onClick={prev} disabled={idx === 0} title="Previous (←)">◀</button>
        <div className="pres-progress">
          <span className="pres-num">{current.num}</span>
          <span className="pres-title">{current.title}</span>
          <span className="pres-count">{idx + 1} / {visibleSlides.length}</span>
        </div>
        <button className="pres-ctl-btn" onClick={next} disabled={idx === visibleSlides.length - 1} title="Next (→ or space)">▶</button>
        <button className="pres-ctl-btn pres-exit" onClick={onExit} title="Exit (Esc)">✕ Exit</button>
      </div>
    </div>
  );
}
