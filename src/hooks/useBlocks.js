import { useState, useEffect, useCallback } from 'react';
import { addSlide } from '../services/slideList.js';

export function useBlocks(slideId) {
  const key = 'blocks_' + slideId;
  const [blocks, setBlocks] = useState([]);

  // Load when slide changes
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      setBlocks(raw ? JSON.parse(raw) : []);
    } catch {
      setBlocks([]);
    }
  }, [key]);

  // Persist
  function persist(next) {
    setBlocks(next);
    try {
      window.localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // ignore
    }
  }

  const add = useCallback(
    (type, data = {}) => {
      const id = 'blk_' + Date.now();
      const next = [...blocks, { id, type, size: 'lg', data }];
      persist(next);
    },
    [blocks, key]
  );

  const addAt = useCallback(
    (type, index, data = {}) => {
      const id = 'blk_' + Date.now();
      const block = { id, type, size: 'lg', data };
      const next = [...blocks.slice(0, index), block, ...blocks.slice(index)];
      persist(next);
    },
    [blocks, key]
  );

  const reorderTo = useCallback(
    (next) => persist(next),
    [key]
  );

  const update = useCallback(
    (id, data) => {
      const next = blocks.map(b => (b.id === id ? { ...b, data: { ...b.data, ...data } } : b));
      persist(next);
    },
    [blocks, key]
  );

  const remove = useCallback(
    id => {
      if (!confirm('Delete this block?')) return;
      persist(blocks.filter(b => b.id !== id));
    },
    [blocks, key]
  );

  const resize = useCallback(
    (id, size) => {
      const next = blocks.map(b => (b.id === id ? { ...b, size } : b));
      persist(next);
    },
    [blocks, key]
  );

  const reorder = useCallback(
    (fromId, toId) => {
      const fromIdx = blocks.findIndex(b => b.id === fromId);
      const toIdx = blocks.findIndex(b => b.id === toId);
      if (fromIdx < 0 || toIdx < 0) return;
      const next = [...blocks];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      persist(next);
    },
    [blocks, key]
  );

  // Break a block out of this slide into a brand new custom slide.
  // Returns the new slide's id (so the caller can navigate to it).
  const breakOut = useCallback(
    (blockId, title) => {
      const block = blocks.find(b => b.id === blockId);
      if (!block) return null;
      const newSlideId = addSlide('s_custom', title);
      // Remove from this slide
      const remaining = blocks.filter(b => b.id !== blockId);
      persist(remaining);
      // Plant in the new slide
      try {
        window.localStorage.setItem('blocks_' + newSlideId, JSON.stringify([block]));
      } catch {
        // ignore
      }
      return newSlideId;
    },
    [blocks, key]
  );

  return { blocks, add, addAt, update, remove, resize, reorder, reorderTo, breakOut };
}
