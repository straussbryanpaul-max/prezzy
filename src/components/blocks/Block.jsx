import { useState, useRef } from 'react';

const SIZE_MAP = { sm: '40%', md: '65%', lg: '100%', half: '50%' };

export default function Block({
  block,
  isDragging,
  dropPosition,
  onDelete,
  onResize,
  onBreakOut,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  children,
}) {
  const [selected, setSelected] = useState(false);
  const [handleHovered, setHandleHovered] = useState(false);

  const sideBySide = block.size === 'half' || block.size === 'sm';
  const style = {
    width: SIZE_MAP[block.size] || '100%',
    display: sideBySide ? 'inline-block' : 'block',
    verticalAlign: sideBySide ? 'top' : undefined,
    marginRight: sideBySide ? '1%' : undefined,
  };

  const cls = [
    'mod-block',
    selected    ? 'selected'    : '',
    isDragging  ? 'dragging'    : '',
    dropPosition === 'before' ? 'drop-before' : '',
    dropPosition === 'after'  ? 'drop-after'  : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      id={block.id}
      className={cls}
      style={style}
      draggable={handleHovered}
      onClick={e => {
        if (e.target.closest('.block-controls')) return;
        setSelected(s => !s);
      }}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
    >
      <div className="block-controls">
        <span
          className="bc-btn bc-drag-handle"
          title="Drag to reorder"
          onMouseEnter={() => setHandleHovered(true)}
          onMouseLeave={() => setHandleHovered(false)}
        >⠿</span>
        <span className="bc-btn" onClick={() => onResize(block.id, 'sm')}   title="Small">S</span>
        <span className="bc-btn" onClick={() => onResize(block.id, 'md')}   title="Medium">M</span>
        <span className="bc-btn" onClick={() => onResize(block.id, 'lg')}   title="Full">L</span>
        <span className="bc-btn" onClick={() => onResize(block.id, 'half')} title="Half width">½</span>
        <span style={{ width: 1, height: 14, background: 'rgba(255,255,255,.2)', margin: '0 2px', display: 'inline-block' }} />
        <span className="bc-btn bc-breakout" onClick={() => onBreakOut?.(block.id)} title="Break out into its own slide">↗ Break out</span>
        <span className="bc-btn del" onClick={() => onDelete(block.id)} title="Delete">🗑</span>
      </div>
      <div className="block-inner">{children}</div>
    </div>
  );
}
