import { useEffect, useRef, useState } from 'react';
import { useLocalStorage, useLocalStorageBool } from '../hooks/useLocalStorage.js';
import { addKnownAssignee, getKnownAssignees } from '../services/assignments.js';

export default function Assignee({ slideId }) {
  const [assignee, setAssignee] = useLocalStorage('assignee_' + slideId, '');
  const [complete, setComplete] = useLocalStorageBool('complete_' + slideId, false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(assignee);
  const [known, setKnown] = useState(() => getKnownAssignees());
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  function commit() {
    const trimmed = draft.trim();
    setAssignee(trimmed);
    if (trimmed) addKnownAssignee(trimmed);
    setKnown(getKnownAssignees());
    setEditing(false);
    window.dispatchEvent(new Event('assignment-change'));
  }

  function cancel() {
    setDraft(assignee);
    setEditing(false);
  }

  function toggleComplete() {
    setComplete(!complete);
    window.dispatchEvent(new Event('assignment-change'));
  }

  return (
    <div className="assignee">
      {editing ? (
        <div className="assignee-edit">
          <input
            ref={inputRef}
            list={`known-assignees-${slideId}`}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') commit();
              if (e.key === 'Escape') cancel();
            }}
            onBlur={commit}
            placeholder="Name…"
            className="assignee-input"
          />
          <datalist id={`known-assignees-${slideId}`}>
            {known.map(n => <option key={n} value={n} />)}
          </datalist>
        </div>
      ) : (
        <button
          className={`assignee-chip${assignee ? ' assigned' : ''}`}
          onClick={() => setEditing(true)}
          title={assignee ? `Assigned to ${assignee} — click to change` : 'Click to assign'}
        >
          {assignee ? `👤 ${assignee}` : '+ Assign'}
        </button>
      )}
      <button
        className={`complete-toggle${complete ? ' done' : ''}`}
        onClick={toggleComplete}
        title={complete ? 'Marked complete — click to reopen' : 'Mark slide complete'}
      >
        {complete ? '✓ Done' : '○ Mark Done'}
      </button>
    </div>
  );
}
