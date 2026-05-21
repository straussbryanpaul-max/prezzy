import { useState } from 'react';
import { SHAPES, SHAPE_COLORS } from '../../data/constants.js';

export default function ShapePicker({ open, onCancel, onConfirm }) {
  const [selected, setSelected] = useState(null);
  const [color, setColor] = useState('#1E2D38');

  if (!open) return null;

  function confirm() {
    if (!selected) return;
    onConfirm({ emoji: selected, color });
    setSelected(null);
  }

  return (
    <div
      className="shape-popup open"
      style={{ top: 'auto', bottom: 100, left: '50%', transform: 'translateX(-50%)' }}
    >
      <button className="sp-close" onClick={onCancel}>✕</button>
      <div className="sp-title">🎨 Choose a Shape or Icon</div>
      <div className="sp-section">Callouts & Banners</div>
      <div className="shape-grid">
        {SHAPES.callouts.map(s => (
          <div
            key={s}
            className={`shape-opt${selected === s ? ' selected' : ''}`}
            onClick={() => setSelected(s)}
          >
            {s}
          </div>
        ))}
      </div>
      <div className="sp-section">Process & Flow</div>
      <div className="shape-grid">
        {SHAPES.flow.map(s => (
          <div
            key={s}
            className={`shape-opt${selected === s ? ' selected' : ''}`}
            onClick={() => setSelected(s)}
          >
            {s}
          </div>
        ))}
      </div>
      <div className="sp-section">Status & Indicators</div>
      <div className="shape-grid">
        {SHAPES.status.map(s => (
          <div
            key={s}
            className={`shape-opt${selected === s ? ' selected' : ''}`}
            onClick={() => setSelected(s)}
          >
            {s}
          </div>
        ))}
      </div>
      <div className="sp-section">Fill Color</div>
      <div className="shape-color-row">
        {SHAPE_COLORS.map(c => (
          <div
            key={c}
            className={`shape-color${color === c ? ' active' : ''}`}
            style={{
              background: c,
              ...(c === '#fff' ? { border: '1px solid #ddd' } : {}),
            }}
            onClick={() => setColor(c)}
            title={c}
          />
        ))}
        <input
          type="color"
          value={color}
          onChange={e => setColor(e.target.value)}
          style={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid #ddd', cursor: 'pointer', padding: 0 }}
        />
      </div>
      <button
        onClick={confirm}
        style={{
          marginTop: 12,
          width: '100%',
          padding: 9,
          background: 'var(--navy)',
          color: '#fff',
          border: 'none',
          borderRadius: 7,
          fontSize: 13,
          fontWeight: 700,
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        ✓ Insert Shape
      </button>
    </div>
  );
}
