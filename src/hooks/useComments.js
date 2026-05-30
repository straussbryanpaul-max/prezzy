import { useState, useCallback, useEffect } from 'react';

const storeKey = id => `comments_${id}`;

function load(slideId) {
  try {
    return JSON.parse(localStorage.getItem(storeKey(slideId)) || '[]');
  } catch { return []; }
}

export function getCommentCount(slideId) {
  return load(slideId).length;
}

export function useComments(slideId) {
  const [comments, setComments] = useState(() => load(slideId));

  useEffect(() => {
    setComments(load(slideId));
  }, [slideId]);

  const add = useCallback((author, text) => {
    const entry = {
      id: `cmt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      author: author.trim(),
      text: text.trim(),
      timestamp: Date.now(),
    };
    setComments(prev => {
      const next = [...prev, entry];
      localStorage.setItem(storeKey(slideId), JSON.stringify(next));
      return next;
    });
  }, [slideId]);

  const remove = useCallback((id) => {
    setComments(prev => {
      const next = prev.filter(c => c.id !== id);
      localStorage.setItem(storeKey(slideId), JSON.stringify(next));
      return next;
    });
  }, [slideId]);

  return { comments, add, remove };
}
