import { useState, useRef } from 'react';
import Block from './Block.jsx';
import { TextBlock, TableBlock, ImageBlock, FileBlock, PowerBIBlock, ShapeBlock } from './blockTypes.jsx';

const TYPE_COMPONENTS = {
  text: TextBlock,
  table: TableBlock,
  image: ImageBlock,
  file: FileBlock,
  pbi: PowerBIBlock,
  shape: ShapeBlock,
};

export default function BlockContainer({ blocks, onUpdate, onDelete, onResize, onReorder, onBreakOut }) {
  const dragSrc = useRef(null);

  function onDragStart(e, id) {
    dragSrc.current = id;
    e.dataTransfer.effectAllowed = 'move';
  }
  function onDragOver(e) {
    e.preventDefault();
  }
  function onDrop(e, targetId) {
    e.preventDefault();
    if (!dragSrc.current || dragSrc.current === targetId) return;
    onReorder(dragSrc.current, targetId);
    dragSrc.current = null;
  }

  if (!blocks.length) return null;

  return (
    <div style={{ marginTop: 20 }}>
      {blocks.map(b => {
        const Comp = TYPE_COMPONENTS[b.type];
        if (!Comp) return null;
        return (
          <Block
            key={b.id}
            block={b}
            onDelete={onDelete}
            onResize={onResize}
            onBreakOut={onBreakOut}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
          >
            <Comp block={b} onUpdate={onUpdate} />
          </Block>
        );
      })}
    </div>
  );
}
