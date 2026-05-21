import { useEffect, useState } from 'react';
import { allSlides } from '../data/sections.js';
import { lsGet } from '../hooks/useLocalStorage.js';

export default function StatusBar({ statusMsg, statusColor, redactVersion }) {
  const [redactCount, setRedactCount] = useState(0);

  useEffect(() => {
    const ct = allSlides.filter(s => lsGet('redact_' + s.id, '') === 'true').length;
    setRedactCount(ct);
  }, [redactVersion]);

  return (
    <div className="statusbar">
      <div className="sdot" style={{ background: statusColor || 'var(--green)' }} />
      <span>{statusMsg || 'Ready'}</span>
      <span>|</span>
      <span>{redactCount} redacted</span>
      <span style={{ marginLeft: 'auto' }}>
        company xyz Internal & External Distribution · ©2025
      </span>
    </div>
  );
}
