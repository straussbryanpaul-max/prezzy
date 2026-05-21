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
