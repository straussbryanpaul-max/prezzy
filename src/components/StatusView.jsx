import { useEffect, useState } from 'react';
import { packageStatus } from '../services/assignments.js';

const STATUS_COLORS = {
  complete: '#10B981',
  in_progress: '#F59E0B',
  untouched: '#94A3B8',
};

const STATUS_LABELS = {
  complete: 'Complete',
  in_progress: 'In progress',
  untouched: 'Untouched',
};

export default function StatusView({ open, onClose, onNavigate }) {
  const [data, setData] = useState(() => packageStatus());

  // Refresh status when modal opens or any assignment/completion changes
  useEffect(() => {
    if (!open) return;
    setData(packageStatus());
    const handler = () => setData(packageStatus());
    window.addEventListener('assignment-change', handler);
    window.addEventListener('storage', handler);
    const tick = setInterval(handler, 1500);
    return () => {
      window.removeEventListener('assignment-change', handler);
      window.removeEventListener('storage', handler);
      clearInterval(tick);
    };
  }, [open]);

  if (!open) return null;

  const assignees = Object.entries(data.byAssignee).sort(([a], [b]) => {
    if (a === '(unassigned)') return 1;
    if (b === '(unassigned)') return -1;
    return a.localeCompare(b);
  });

  function jumpTo(slideId) {
    onNavigate?.(slideId);
    onClose();
  }

  return (
    <div className="modal-bg open" onClick={onClose}>
      <div className="modal status-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-hdr">
          <h3>📊 Package Status</h3>
          <button className="modal-x" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="status-summary">
            <div className="status-bar">
              <div
                className="status-bar-fill complete"
                style={{ width: `${(data.complete / data.total) * 100}%` }}
              />
              <div
                className="status-bar-fill progress"
                style={{ width: `${(data.inProgress / data.total) * 100}%` }}
              />
            </div>
            <div className="status-stats">
              <span><strong>{data.percentComplete}%</strong> complete</span>
              <span className="dot" />
              <span><span className="status-dot complete" /> {data.complete} done</span>
              <span><span className="status-dot progress" /> {data.inProgress} in progress</span>
              <span><span className="status-dot untouched" /> {data.untouched} untouched</span>
            </div>
          </div>

          {assignees.map(([name, stats]) => (
            <div key={name} className="status-group">
              <div className="status-group-hdr">
                <strong>{name === '(unassigned)' ? '👻 Unassigned' : `👤 ${name}`}</strong>
                <span className="status-group-counts">
                  {stats.complete}✓ · {stats.in_progress}⏳ · {stats.untouched}○
                </span>
              </div>
              <div className="status-group-slides">
                {stats.slides.map(sl => (
                  <button
                    key={sl.id}
                    className={`status-slide-row status-${sl.status}`}
                    onClick={() => jumpTo(sl.id)}
                  >
                    <span
                      className="status-dot"
                      style={{ background: STATUS_COLORS[sl.status] }}
                    />
                    <span className="status-slide-num">{sl.num}</span>
                    <span className="status-slide-title">{sl.title}</span>
                    <span className="status-slide-status">{STATUS_LABELS[sl.status]}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
