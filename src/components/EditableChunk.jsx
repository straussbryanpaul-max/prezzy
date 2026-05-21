import { useLocalStorage, useLocalStorageBool } from '../hooks/useLocalStorage.js';

const SIZE_MAP = { sm: '40%', md: '65%', half: '50%', lg: '100%' };

export default function EditableChunk({ id, label, children }) {
  const [deleted, setDeletedRaw] = useLocalStorageBool('chunk_del_' + id, false);
  const [size, setSize] = useLocalStorage('chunk_size_' + id, 'lg');

  function setDeleted(v) {
    setDeletedRaw(v);
    window.dispatchEvent(new Event('drift-state-change'));
  }

  function breakOut() {
    window.dispatchEvent(
      new CustomEvent('chunk-break-out', {
        detail: { chunkId: id, label: label || 'New Slide' },
      })
    );
  }

  if (deleted) {
    return (
      <div className="deleted-chunk-ghost" onClick={() => setDeleted(false)}>
        <span>🗑 {label || 'Element'} deleted</span>
        <button>+ Restore</button>
      </div>
    );
  }

  const sideBySide = size === 'sm' || size === 'half';
  const style = {
    width: SIZE_MAP[size] || '100%',
    display: sideBySide ? 'inline-block' : 'block',
    verticalAlign: sideBySide ? 'top' : undefined,
    marginRight: sideBySide ? '1%' : undefined,
    marginBottom: 16,
  };

  return (
    <div className="editable-chunk" style={style}>
      <div className="chunk-ctl-bar">
        <button
          className={`chunk-ctl${size === 'sm' ? ' active' : ''}`}
          onClick={() => setSize('sm')}
          title="Small (40%)"
        >
          S
        </button>
        <button
          className={`chunk-ctl${size === 'half' ? ' active' : ''}`}
          onClick={() => setSize('half')}
          title="Half (50%)"
        >
          ½
        </button>
        <button
          className={`chunk-ctl${size === 'md' ? ' active' : ''}`}
          onClick={() => setSize('md')}
          title="Medium (65%)"
        >
          M
        </button>
        <button
          className={`chunk-ctl${size === 'lg' ? ' active' : ''}`}
          onClick={() => setSize('lg')}
          title="Full width"
        >
          L
        </button>
        <span className="chunk-ctl-sep" />
        <button
          className="chunk-ctl chunk-ctl-breakout"
          onClick={breakOut}
          title="Break out into its own numbered slide (creates an empty new slide; rebuild content there)"
        >
          ↗ Split off
        </button>
        <button
          className="chunk-ctl del"
          onClick={() => setDeleted(true)}
          title="Delete this element"
        >
          🗑
        </button>
      </div>
      <div className="chunk-inner">{children}</div>
    </div>
  );
}
