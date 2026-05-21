import { useLocalStorageBool } from '../hooks/useLocalStorage.js';

export default function RedactCheck({ slideId, onChange }) {
  const [checked, setChecked] = useLocalStorageBool('redact_' + slideId, false);
  return (
    <label className="redact-check">
      <input
        type="checkbox"
        checked={checked}
        onChange={e => {
          setChecked(e.target.checked);
          if (onChange) onChange(e.target.checked);
        }}
      />
      🔒 Redacted
    </label>
  );
}
