import { sections } from '../data/sections.js';
import { lsGet } from '../hooks/useLocalStorage.js';

function isRedacted(sl) {
  return sl.redacted || lsGet('redact_' + sl.id, '') === 'true';
}

function isPreRead(sl) {
  const stored = lsGet('preread_' + sl.id, '');
  if (stored === '') return !!sl.preread;
  return stored === 'true';
}

export default function TOC() {
  return (
    <>
      <div className="section-divider">
        <h1>Table of Contents</h1>
        <div className="sub">Auto-generated from active slides</div>
      </div>
      <div className="slide-card">
        <div className="card-body">
          {sections.map(sec => (
            <div key={sec.id} style={{ marginBottom: 12 }}>
              <strong style={{ color: 'var(--navy)' }}>{sec.title}</strong>
              {sec.slides.map(sl => {
                const redacted = isRedacted(sl);
                const preread = isPreRead(sl);
                return (
                  <div
                    key={sl.id}
                    style={{
                      padding: '2px 0 2px 20px',
                      fontSize: 13,
                      color: 'var(--gray3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <span>{sl.num} — {sl.title}</span>
                    {redacted && (
                      <span title="Redacted" style={{ color: 'var(--red)', fontSize: 12 }}>🔒</span>
                    )}
                    {preread && !redacted && (
                      <span
                        title="Pre-Read Only"
                        style={{
                          background: '#DBEAFE',
                          color: '#1E40AF',
                          padding: '1px 6px',
                          borderRadius: 4,
                          fontSize: 9,
                          fontWeight: 700,
                          letterSpacing: 0.5,
                        }}
                      >
                        📖 PRE-READ
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
