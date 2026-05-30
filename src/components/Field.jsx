import { useRef, useEffect } from 'react';
import { useLocalStorage, lsGet, lsSet } from '../hooks/useLocalStorage.js';

export function Input({ name, placeholder, type = 'text', onChangeExtra }) {
  const [value, setValue] = useLocalStorage('f_' + name, '');
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={e => {
        setValue(e.target.value);
        if (onChangeExtra) onChangeExtra(e.target.value);
      }}
    />
  );
}

export function Select({ name, options }) {
  const [value, setValue] = useLocalStorage('f_' + name, '');
  return (
    <select value={value} onChange={e => setValue(e.target.value)}>
      <option value="">— Select —</option>
      {options.map(o => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

export function TextArea({ name, placeholder, rows = 4 }) {
  const [value, setValue] = useLocalStorage('f_' + name, '');
  return (
    <textarea
      rows={rows}
      value={value}
      placeholder={placeholder}
      onChange={e => setValue(e.target.value)}
    />
  );
}

export function FormGroup({ label, children }) {
  const key = label ? 'f_lbl_' + label.toLowerCase().replace(/[^a-z0-9]+/g, '_') : null;
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && key) {
      ref.current.textContent = lsGet(key, label);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="form-group">
      {label && (
        <label
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          onBlur={() => key && lsSet(key, ref.current?.textContent?.trim() || label)}
          className="editable-label"
          title="Click to rename this label"
        />
      )}
      {children}
    </div>
  );
}

export function FormRow({ children, cols = 2 }) {
  return <div className={cols === 3 ? 'form-row-3' : 'form-row'}>{children}</div>;
}
