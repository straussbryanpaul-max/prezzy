import { useState } from 'react';
import { sections } from '../data/sections.js';
import { lsGet } from '../hooks/useLocalStorage.js';

function isSlideRedacted(id) {
  return lsGet('redact_' + id, '') === 'true';
}

export default function Sidebar({ activeSlideId, showRedacted, onNavigate, redactVersion }) {
  const [collapsed, setCollapsed] = useState({});

  function toggleSection(id) {
    setCollapsed(prev => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="sidebar">
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
                  if (!showRedacted && redacted) return null;
                  const cls =
                    (sl.id === activeSlideId ? 'active ' : '') +
                    (redacted ? 'redacted-item ' : '');
                  return (
                    <div
                      key={sl.id}
                      className={`slide-item ${cls}`}
                      data-redact-version={redactVersion}
                      onClick={() => onNavigate(sl.id)}
                    >
                      <span>{sl.num}</span> {sl.title}
                      {sl.redacted ? (
                        <span className="badge">🔒</span>
                      ) : sl.preread ? (
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
