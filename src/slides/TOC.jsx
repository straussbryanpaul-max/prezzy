import { sections } from '../data/sections.js';

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
              {sec.slides.map(sl => (
                <div key={sl.id} style={{ padding: '2px 0 2px 20px', fontSize: 13, color: 'var(--gray3)' }}>
                  {sl.num} — {sl.title}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
