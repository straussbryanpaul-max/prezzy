import { useState, Fragment } from 'react';
import Block from './Block.jsx';
import { TextBlock, HeadingBlock, FieldBlock, FormSectionBlock, TableBlock, ImageBlock, FileBlock, EmbedBlock, PowerBIBlock, ShapeBlock } from './blockTypes.jsx';

const TYPE_COMPONENTS = {
  text: TextBlock,
  heading: HeadingBlock,
  field: FieldBlock,
  formsection: FormSectionBlock,
  table: TableBlock,
  image: ImageBlock,
  file: FileBlock,
  embed: EmbedBlock,
  pbi: PowerBIBlock,
  shape: ShapeBlock,
};

const INSERT_TYPES = [
  { type: 'heading',     icon: '🔤', label: 'Heading' },
  { type: 'text',        icon: '📝', label: 'Text' },
  { type: 'field',       icon: '📋', label: 'Field' },
  { type: 'formsection', icon: '🗂',  label: 'Form Section' },
  { type: 'table',       icon: '📊', label: 'Table' },
  { type: 'image',       icon: '🖼️', label: 'Image' },
  { type: 'embed',       icon: '📄', label: 'Embed File' },
  { type: 'pbi',         icon: '⚡', label: 'Power BI' },
  { type: 'file',        icon: '📎', label: 'File' },
  { type: 'shape',       icon: '🎨', label: 'Shape' },
];

export default function BlockContainer({ blocks, onUpdate, onDelete, onResize, onReorderTo, onAddAt, onBreakOut }) {
  const [dragId,    setDragId]    = useState(null);
  const [dropInfo,  setDropInfo]  = useState(null); // { blockId, position: 'before'|'after' }
  const [openGap,   setOpenGap]   = useState(null); // gap index with picker open

  function startDrag(e, id) {
    setDragId(id);
    setOpenGap(null);
    e.dataTransfer.effectAllowed = 'move';
  }

  function endDrag() {
    setDragId(null);
    setDropInfo(null);
  }

  function handleDragOver(e, blockId) {
    e.preventDefault();
    if (dragId === blockId) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const position = e.clientY < rect.top + rect.height / 2 ? 'before' : 'after';
    if (dropInfo?.blockId !== blockId || dropInfo?.position !== position) {
      setDropInfo({ blockId, position });
    }
  }

  function handleDrop(e, blockId) {
    e.preventDefault();
    if (!dragId || dragId === blockId) { endDrag(); return; }
    const fromIdx = blocks.findIndex(b => b.id === dragId);
    if (fromIdx < 0) { endDrag(); return; }
    const next = [...blocks];
    const [moved] = next.splice(fromIdx, 1);
    const newToIdx = next.findIndex(b => b.id === blockId);
    if (newToIdx < 0) { endDrag(); return; }
    next.splice(dropInfo?.position === 'before' ? newToIdx : newToIdx + 1, 0, moved);
    onReorderTo(next);
    endDrag();
  }

  function renderGap(index) {
    const isOpen = openGap === index;
    return (
      <div
        key={`gap-${index}`}
        className={`block-gap${isOpen ? ' open' : ''}`}
      >
        <button
          className="block-gap-btn"
          title="Insert block here"
          onClick={e => { e.stopPropagation(); setOpenGap(isOpen ? null : index); }}
        >+</button>
        {isOpen && (
          <div className="block-gap-picker" onClick={e => e.stopPropagation()}>
            {INSERT_TYPES.map(t => (
              <button
                key={t.type}
                className="block-gap-type-btn"
                onClick={() => { onAddAt(t.type, index); setOpenGap(null); }}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (!blocks.length) return null;

  return (
    <div style={{ marginTop: 20 }} onClick={() => setOpenGap(null)}>
      {renderGap(0)}
      {blocks.map((b, i) => {
        const Comp = TYPE_COMPONENTS[b.type];
        if (!Comp) return null;
        return (
          <Fragment key={b.id}>
            <Block
              block={b}
              isDragging={dragId === b.id}
              dropPosition={dropInfo?.blockId === b.id ? dropInfo.position : null}
              onDelete={onDelete}
              onResize={onResize}
              onBreakOut={onBreakOut}
              onDragStart={e => startDrag(e, b.id)}
              onDragOver={e => handleDragOver(e, b.id)}
              onDrop={e => handleDrop(e, b.id)}
              onDragEnd={endDrag}
            >
              <Comp block={b} onUpdate={onUpdate} />
            </Block>
            {renderGap(i + 1)}
          </Fragment>
        );
      })}
    </div>
  );
}
