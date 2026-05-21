import { useState } from 'react';

export default function Guidance({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`guidance${open ? ' open' : ''}`} onClick={() => setOpen(o => !o)}>
      <div className="guidance-header">💡 Template Guidance (click to expand)</div>
      {open && <div className="guidance-body">{children}</div>}
    </div>
  );
}
