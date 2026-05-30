import { useState, useRef, useEffect } from 'react';
import { lsGet, lsSet } from '../hooks/useLocalStorage.js';

function makeKey(defaultText) {
  return 'guidance_' + String(defaultText || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .slice(0, 50);
}

export default function Guidance({ children }) {
  const [open, setOpen] = useState(false);
  const key = makeKey(children);
  const ref = useRef(null);

  useEffect(() => {
    if (open && ref.current) {
      ref.current.textContent = lsGet(key, String(children || ''));
    }
  }, [open]);

  return (
    <div className={`guidance${open ? ' open' : ''}`}>
      <div className="guidance-header" onClick={() => setOpen(o => !o)}>
        <span>💡 Template Guidance</span>
        <span className="guidance-toggle">{open ? '▲ collapse' : '▼ expand'}</span>
      </div>
      {open && (
        <div className="guidance-body">
          <span
            ref={ref}
            contentEditable
            suppressContentEditableWarning
            className="guidance-text"
            title="Click to edit guidance"
            onBlur={() => {
              if (ref.current) lsSet(key, ref.current.textContent.trim() || String(children || ''));
            }}
          />
        </div>
      )}
    </div>
  );
}
