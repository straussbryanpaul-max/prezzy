import { useEffect } from 'react';
import { allSlides } from '../data/sections.js';
import { lsGet } from '../hooks/useLocalStorage.js';
import { useBlocks } from '../hooks/useBlocks.js';
import SlideRouter from '../slides/index.jsx';
import BlockContainer from './blocks/BlockContainer.jsx';

function isSlideRedacted(sl) {
  return sl.redacted || lsGet('redact_' + sl.id, '') === 'true';
}

// Render a single slide block (slide + its modular blocks) in print mode.
function PrintSlide({ slide, showRedacted, isFirst }) {
  const { blocks } = useBlocks(slide.id);
  const redacted = isSlideRedacted(slide);
  const hide = redacted && !showRedacted;

  return (
    <div className={`print-slide${isFirst ? ' print-slide-first' : ''}`}>
      <div className="print-slide-header">
        <span className="print-slide-num">{slide.num}</span>
        <span className="print-slide-title">{slide.title}</span>
      </div>
      <div className={`print-slide-body${hide ? ' redacted-on' : ''}`}>
        <SlideRouter slideId={slide.id} onRedactChange={() => {}} />
        <BlockContainer
          blocks={blocks}
          onUpdate={() => {}}
          onDelete={() => {}}
          onResize={() => {}}
          onReorder={() => {}}
        />
        {hide && (
          <div className="redacted-shroud">
            <div className="redacted-shroud-text">REDACTED</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PrintView({ showRedacted, onAfterPrint }) {
  // After mount, trigger the print dialog. The browser opens it asynchronously;
  // when it closes we exit print mode.
  useEffect(() => {
    const t = setTimeout(() => {
      window.print();
      // Best-effort: react to afterprint, but also fall back to a delay.
      const cleanup = () => {
        onAfterPrint?.();
        window.removeEventListener('afterprint', cleanup);
      };
      window.addEventListener('afterprint', cleanup);
      // Safari/old Firefox sometimes don't fire afterprint reliably
      setTimeout(cleanup, 30000);
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="print-root">
      {allSlides.map((sl, i) => (
        <PrintSlide
          key={sl.id}
          slide={sl}
          showRedacted={showRedacted}
          isFirst={i === 0}
        />
      ))}
    </div>
  );
}
