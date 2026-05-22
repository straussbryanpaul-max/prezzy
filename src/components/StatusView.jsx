import { useEffect, useRef, useState } from 'react';
import { packageStatus, addKnownAssignee, getKnownAssignees } from '../services/assignments.js';
import { lsSet } from '../hooks/useLocalStorage.js';

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

// Top-level component — must NOT be defined inside StatusView or it would
// be re-created on every parent render and the input would lose focus.
function InlineAssign({ slideId, current }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(current || '');
  const [known, setKnown] = useState(() => getKnownAssignees());
  const inputRef = useRef(null);

  // Sync draft when current changes from outside (e.g. polling refresh)
  useEffect(() => {
    if (!editing) setDraft(current || '');
  }, [current, editing]);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  function commit() {
    const trimmed = draft.trim();
    lsSet('assignee_' + slideId, trimmed);
    if (trimmed) addKnownAssignee(trimmed);
    setKnown(getKnownAssignees());
    setEditing(false);
    window.dispatchEvent(new Event('assignment-change'));
  }

  function cancel() {
    setDraft(current || '');
    setEditing(false);
  }

  if (editing) {
    return (
      <span className="status-slide-assign-cell">
        <input
          ref={inputRef}
          className="status-assign-input"
          list={`status-assignees-${slideId}`}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={e => {
            if (e.key === 'Enter') { e.preventDefault(); commit(); }
            if (e.key === 'Escape') { e.preventDefault(); cancel(); }
          }}
          placeholder="name…"
        />
        <datalist id={`status-assignees-${slideId}`}>
          {known.map(n => <option key={n} value={n} />)}
        </datalist>
      </span>
    );
  }

  return (
    <button
      className={`status-assign-chip${current ? ' assigned' : ''}`}
      onClick={() => setEditing(true)}
      title={current ? `Assigned to ${current} — click to change` : 'Click to assign'}
    >
      {current ? `👤 ${current}` : '+ assign'}
    </button>
  );
}

function StatusSlideRow({ sl, onJump }) {
  return (
    <div className={`status-slide-row status-${sl.status}`}>
      <button className="status-slide-jump" onClick={() => onJump(sl.id)}>
        <span className="status-dot" style={{ background: STATUS_COLORS[sl.status] }} />
        <span className="status-slide-num">{sl.num}</span>
        <span className="status-slide-title">{sl.title}</span>
      </button>
      <InlineAssign slideId={sl.id} current={sl.assignee} />
      <span className="status-slide-status">{STATUS_LABELS[sl.status]}</span>
    </div>
  );
}

export default function StatusView({ open, onClose, onNavigate }) {
  const [data, setData] = useState(() => packageStatus());
  const [groupBy, setGroupBy] = useState('assignee'); // 'assignee' | 'flat'

  // Refresh status when modal opens or any assignment/completion changes.
  // Note: we DON'T poll here because polling re-renders would interrupt
  // any in-progress text input. Events are sufficient.
  useEffect(() => {
    if (!open) return;
    setData(packageStatus());
    const handler = () => setData(packageStatus());
    window.addEventListener('assignment-change', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('assignment-change', handler);
      window.removeEventListener('storage', handler);
    };
  }, [open]);

  if (!open) return null;

  const assignees = Object.entries(data.byAssignee).sort(([a], [b]) => {
    if (a === '(unassigned)') return 1;
    if (b === '(unassigned)') return -1;
    return a.localeCompare(b);
  });

  const flatSlides = assignees.flatMap(([, s]) => s.slides);

  function jumpTo(slideId) {
    onNavigate?.(slideId);
    onClose();
  }

  return (
    <div className="modal-bg open" onClick={onClose}>
      <div className="modal status-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-hdr">
          <h3>📊 Package Status — {data.total} slides total</h3>
          <button className="modal-x" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="status-summary">
            <div className="status-bar">
              <div className="status-bar-fill complete" style={{ width: `${(data.complete / data.total) * 100}%` }} />
              <div className="status-bar-fill progress" style={{ width: `${(data.inProgress / data.total) * 100}%` }} />
            </div>
            <div className="status-stats">
              <span><strong>{data.percentComplete}%</strong> complete</span>
              <span className="dot" />
              <span><span className="status-dot complete" /> {data.complete} done</span>
              <span><span className="status-dot progress" /> {data.inProgress} in progress</span>
              <span><span className="status-dot untouched" /> {data.untouched} untouched</span>
            </div>
            <div className="status-toolbar">
              <span className="status-toolbar-label">Group by:</span>
              <button
                className={`status-pill${groupBy === 'assignee' ? ' active' : ''}`}
                onClick={() => setGroupBy('assignee')}
              >
                Assignee
              </button>
              <button
                className={`status-pill${groupBy === 'flat' ? ' active' : ''}`}
                onClick={() => setGroupBy('flat')}
              >
                Flat list ({data.total})
              </button>
            </div>
          </div>

          {groupBy === 'assignee' ? (
            assignees.map(([name, stats]) => (
              <div key={name} className="status-group">
                <div className="status-group-hdr">
                  <strong>{name === '(unassigned)' ? '👻 Unassigned' : `👤 ${name}`}</strong>
                  <span className="status-group-counts">
                    {stats.slides.length} slides · {stats.complete}✓ · {stats.in_progress}⏳ · {stats.untouched}○
                  </span>
                </div>
                <div className="status-group-slides">
                  {stats.slides.map(sl => (
                    <StatusSlideRow key={sl.id} sl={sl} onJump={jumpTo} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="status-group">
              <div className="status-group-hdr">
                <strong>All slides</strong>
                <span className="status-group-counts">{flatSlides.length} total</span>
              </div>
              <div className="status-group-slides">
                {flatSlides.map(sl => (
                  <StatusSlideRow key={sl.id} sl={sl} onJump={jumpTo} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
