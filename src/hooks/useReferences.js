import { useEffect, useState, useCallback } from 'react';
import {
  getReferences,
  getReferencesForSlide,
  addManualReference,
  removeReference,
} from '../services/references.js';

// Returns references for a given slide id (newest first), with live updates
// whenever the references store changes.
export function useReferences(slideId) {
  const [references, setReferences] = useState(() =>
    slideId ? getReferencesForSlide(slideId) : []
  );

  useEffect(() => {
    function refresh() {
      setReferences(slideId ? getReferencesForSlide(slideId) : []);
    }
    refresh();
    window.addEventListener('references-change', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('references-change', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [slideId]);

  const add = useCallback(
    ({ label, source, text }) => addManualReference({ slideId, label, source, text }),
    [slideId]
  );

  const remove = useCallback(id => removeReference(id), []);

  return { references, add, remove };
}

// All references across the whole library, with live updates.
export function useAllReferences() {
  const [references, setReferences] = useState(() => getReferences());
  useEffect(() => {
    function refresh() {
      setReferences(getReferences());
    }
    refresh();
    window.addEventListener('references-change', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('references-change', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);
  return references;
}
