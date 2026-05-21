export default function PreReadCheck({ checked, onChange }) {
  return (
    <label className="preread-check" title="Pre-Read Only — don't stop here during the live review">
      <input
        type="checkbox"
        checked={!!checked}
        onChange={e => onChange?.(e.target.checked)}
      />
      📖 Pre-Read
    </label>
  );
}
