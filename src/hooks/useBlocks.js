import { useState, useEffect, useCallback } from 'react';

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

  return { blocks, add, update, remove, resize, reorder };
}
