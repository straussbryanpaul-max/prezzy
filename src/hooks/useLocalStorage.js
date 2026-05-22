import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage(key, initialValue = '') {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? item : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Pick up external writes (e.g. from AI generators or other tabs)
  useEffect(() => {
    function handler(e) {
      const changedKey = e.detail?.key ?? e.key;
      if (changedKey !== key) return;
      try {
        const item = window.localStorage.getItem(key);
        setValue(item !== null ? item : initialValue);
      } catch {
        // ignore
      }
    }
    window.addEventListener('local-storage-change', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('local-storage-change', handler);
      window.removeEventListener('storage', handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = useCallback(
    newVal => {
      setValue(newVal);
      try {
        window.localStorage.setItem(key, newVal);
      } catch {
        // ignore quota / privacy errors
      }
    },
    [key]
  );

  return [value, update];
}

export function useLocalStorageBool(key, initialValue = false) {
  const [value, setValue] = useState(() => {
    const item = window.localStorage.getItem(key);
    if (item === null) return initialValue;
    return item === 'true';
  });

  const update = useCallback(
    newVal => {
      setValue(newVal);
      window.localStorage.setItem(key, String(newVal));
    },
    [key]
  );

  return [value, update];
}

export function lsGet(key, fallback = '') {
  try {
    const v = window.localStorage.getItem(key);
    return v === null ? fallback : v;
  } catch {
    return fallback;
  }
}

export function lsSet(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

// Like lsSet but also notifies any useLocalStorage hooks watching this key
// (within the same tab — the native 'storage' event only fires cross-tab).
export function lsSetAndNotify(key, value) {
  lsSet(key, value);
  window.dispatchEvent(new CustomEvent('local-storage-change', { detail: { key } }));
}
