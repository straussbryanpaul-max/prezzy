import { useLocalStorage, useLocalStorageBool } from '../hooks/useLocalStorage.js';
import RedactCheck from './RedactCheck.jsx';

const SIZE_MAP = { sm: '40%', md: '65%', half: '50%', lg: '100%' };

export default function Card({ slideId, title, num, children, onRedactChange }) {
  const [deleted, setDeleted] = useLocalStorageBool('sec_del_' + slideId, false);
  const [size, setSize] = useLocalStorage('sec_size_' + slideId, 'lg');

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
    <div className="editable-section" style={wrapperStyle}>
      <div className="sec-ctl-bar">
        <button
          className={`sec-ctl${size === 'sm' ? ' active' : ''}`}
          onClick={() => setSize('sm')}
          title="Small (40%)"
        >
          S
        </button>
        <button
          className={`sec-ctl${size === 'md' ? ' active' : ''}`}
          onClick={() => setSize('md')}
          title="Medium (65%)"
        >
          M
        </button>
        <button
          className={`sec-ctl${size === 'half' ? ' active' : ''}`}
          onClick={() => setSize('half')}
          title="Half (50%)"
        >
          ½
        </button>
        <button
          className={`sec-ctl${size === 'lg' ? ' active' : ''}`}
          onClick={() => setSize('lg')}
          title="Full width"
        >
          L
        </button>
        <span className="sec-ctl-sep" />
        <button
          className="sec-ctl del"
          onClick={() => setDeleted(true)}
          title="Delete this section (can be restored)"
        >
          🗑
        </button>
      </div>
      <div className="slide-card" id={`card_${slideId}`}>
        <div className="card-header">
          <div>
            <div className="slide-num">{num}</div>
            <h2>{title}</h2>
          </div>
          <RedactCheck slideId={slideId} onChange={onRedactChange} />
        </div>
        <div className="card-body">{children}</div>
      </div>
    </div>
  );
}
