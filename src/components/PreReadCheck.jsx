import { useLocalStorageBool } from '../hooks/useLocalStorage.js';

export default function PreReadCheck({ slideId, templateDefault = false, onChange }) {
  const [userOverride, setUserOverride] = useLocalStorageBool('preread_' + slideId, templateDefault);

  return (
    <label className="preread-check" title="Pre-Read Only — don't stop here during the live review">
      <input
        type="checkbox"
        checked={userOverride}
        onChange={e => {
          setUserOverride(e.target.checked);
          if (onChange) onChange(e.target.checked);
        }}
      />
      📖 Pre-Read
    </label>
  );
}
