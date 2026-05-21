import { useLocalStorage, useLocalStorageBool } from '../hooks/useLocalStorage.js';
import { allSlides } from '../data/sections.js';
import RedactCheck from './RedactCheck.jsx';
import PreReadCheck from './PreReadCheck.jsx';

const SIZE_MAP = { sm: '40%', md: '65%', half: '50%', lg: '100%' };

export default function Card({ slideId, title, num, children, onRedactChange }) {
  const [deleted, setDeleted] = useLocalStorageBool('sec_del_' + slideId, false);
  const [size, setSize] = useLocalStorage('sec_size_' + slideId, 'lg');

  // Pre-read: defaults from template, can be overridden via checkbox.
  const slide = allSlides.find(s => s.id === slideId);
  const templateDefault = !!slide?.preread;
  const [preread, setPreread] = useLocalStorageBool('preread_' + slideId, templateDefault);

  if (deleted) {
    return (
      <div className="deleted-section-ghost" onClick={() => setDeleted(false)}>
        <span>🗑 Section "{title}" deleted</span>
        <button>+ Restore</button>
      </div>
    );
  }

  const sideBySide = size === 'sm' || size === 'half';
  const wrapperStyle = {
    width: SIZE_MAP[size] || '100%',
    display: sideBySide ? 'inline-block' : 'block',
    verticalAlign: sideBySide ? 'top' : undefined,
    marginRight: sideBySide ? '1%' : undefined,
    marginBottom: 24,
  };

  return (
    <div className={`editable-section${preread ? ' is-preread' : ''}`} style={wrapperStyle}>
      <div className="sec-ctl-bar">
        <button className={`sec-ctl${size === 'sm' ? ' active' : ''}`} onClick={() => setSize('sm')} title="Small (40%)">S</button>
        <button className={`sec-ctl${size === 'md' ? ' active' : ''}`} onClick={() => setSize('md')} title="Medium (65%)">M</button>
        <button className={`sec-ctl${size === 'half' ? ' active' : ''}`} onClick={() => setSize('half')} title="Half (50%)">½</button>
        <button className={`sec-ctl${size === 'lg' ? ' active' : ''}`} onClick={() => setSize('lg')} title="Full width">L</button>
        <span className="sec-ctl-sep" />
        <button className="sec-ctl del" onClick={() => setDeleted(true)} title="Delete this section (can be restored)">🗑</button>
      </div>

      {preread && (
        <div className="preread-banner">
          <span className="preread-banner-icon">📖</span>
          <span className="preread-banner-text">
            <strong>PRE-READ ONLY</strong> — Background material, not for live review
          </span>
        </div>
      )}

      <div className="slide-card" id={`card_${slideId}`}>
        <div className="card-header">
          <div>
            <div className="slide-num">{num}</div>
            <h2>{title}</h2>
          </div>
          <div className="card-header-checks">
            <PreReadCheck checked={preread} onChange={setPreread} />
            <RedactCheck slideId={slideId} onChange={onRedactChange} />
          </div>
        </div>
        <div className="card-body">{children}</div>
      </div>
    </div>
  );
}
