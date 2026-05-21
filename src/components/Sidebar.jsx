import { useState } from 'react';
import { sections } from '../data/sections.js';
import { lsGet } from '../hooks/useLocalStorage.js';

function isSlideRedacted(id) {
  return lsGet('redact_' + id, '') === 'true';
}

function isSlidePreRead(sl) {
  const stored = lsGet('preread_' + sl.id, '');
  if (stored === '') return !!sl.preread;
  return stored === 'true';
}

export default function Sidebar({
  activeSlideId,
  showRedacted,
  onNavigate,
  redactVersion,
  preReadVersion,
  open = true,
  onClose,
}) {
  const [collapsed, setCollapsed] = useState({});

  function toggleSection(id) {
    setCollapsed(prev => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className={`sidebar${open ? '' : ' hidden'}`}>
      <button className="sidebar-close" onClick={onClose} title="Hide sidebar">
        ◀
      </button>
      {sections.map(sec => {
        const isCollapsed = !!collapsed[sec.id];
        return (
          <div key={sec.id} className="section-group">
            <div
              className={`section-header${isCollapsed ? ' collapsed' : ''}`}
              onClick={() => toggleSection(sec.id)}
            >
              {sec.title}
              <span className="arrow">▼</span>
            </div>
            {!isCollapsed && (
              <div className="section-items">
                {sec.slides.map(sl => {
                  const redacted = sl.redacted || isSlideRedacted(sl.id);
                  const preread = isSlidePreRead(sl);
                  const cls =
                    (sl.id === activeSlideId ? 'active ' : '') +
                    (redacted && !showRedacted ? 'redacted-item ' : '');
                  return (
                    <div
                      key={sl.id}
                      className={`slide-item ${cls}`}
                      data-redact-version={redactVersion}
                      data-preread-version={preReadVersion}
                      onClick={() => onNavigate(sl.id)}
                    >
                      <span>{sl.num}</span> {sl.title}
                      {redacted ? (
                        <span className="badge">🔒</span>
                      ) : preread ? (
                        <span className="badge chip chip-preread">PRE-READ</span>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
