import { sections } from '../data/sections.js';
import { lsGet } from '../hooks/useLocalStorage.js';

function isSlideRedacted(slideId) {
  // Check static + dynamic redaction
  const sl = sections.flatMap(s => s.slides).find(s => s.id === slideId);
  if (sl?.redacted) return true;
  return lsGet('redact_' + slideId, '') === 'true';
}

export default function RedactedShroud({ slideId, showRedacted, children, redactVersion }) {
  // Discipline routing: disc_civil etc. use disc_<id> as the slideId
  const redacted = isSlideRedacted(slideId);
  const hide = redacted && !showRedacted;

  return (
    <div className={`redacted-wrap${hide ? ' redacted-on' : ''}`} data-rv={redactVersion}>
      {children}
      {hide && (
        <div className="redacted-shroud">
          <div className="redacted-shroud-text">REDACTED</div>
          <div className="redacted-shroud-sub">
            Enable "Show Redacted" in the top bar to view this slide
          </div>
        </div>
      )}
    </div>
  );
}
