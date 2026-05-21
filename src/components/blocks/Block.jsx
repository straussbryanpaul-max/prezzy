import { useState, useRef } from 'react';

const SIZE_MAP = { sm: '40%', md: '65%', lg: '100%', half: '50%' };

export default function Block({
  block,
  onDelete,
  onResize,
  onBreakOut,
  onDragStart,
  onDragOver,
  onDrop,
  children,
}) {
  const [selected, setSelected] = useState(false);
  const ref = useRef(null);

  const sideBySide = block.size === 'half' || block.size === 'sm';
  const style = {
    width: SIZE_MAP[block.size] || '100%',
    display: sideBySide ? 'inline-block' : 'block',
    verticalAlign: sideBySide ? 'top' : undefined,
    marginRight: sideBySide ? '1%' : undefined,
  };

  return (
    <div
      ref={ref}
      id={block.id}
      className={`mod-block${selected ? ' selected' : ''}`}
      style={style}
      draggable
      onClick={e => {
        if (e.target.closest('.block-controls')) return;
        setSelected(s => !s);
      }}
      onDragStart={e => onDragStart?.(e, block.id)}
      onDragOver={e => onDragOver?.(e, block.id)}
      onDrop={e => onDrop?.(e, block.id)}
    >
      <div className="block-controls">
        <span className="bc-btn" title="Drag to reorder" style={{ cursor: 'grab' }}>⠿</span>
        <span className="bc-btn" onClick={() => onResize(block.id, 'sm')} title="Small">S</span>
        <span className="bc-btn" onClick={() => onResize(block.id, 'md')} title="Medium">M</span>
        <span className="bc-btn" onClick={() => onResize(block.id, 'lg')} title="Full">L</span>
        <span className="bc-btn" onClick={() => onResize(block.id, 'half')} title="Half width">½</span>
        <span style={{ width: 1, height: 14, background: 'rgba(255,255,255,.2)', margin: '0 2px', display: 'inline-block' }}></span>
        <span
          className="bc-btn"
          onClick={() => onBreakOut?.(block.id)}
          title="Break out into its own numbered slide"
        >
          ↗
        </span>
        <span className="bc-btn del" onClick={() => onDelete(block.id)} title="Delete">🗑</span>
      </div>
      <div className="block-inner">{children}</div>
    </div>
  );
}
