import { useRef } from 'react';
import { allSlides } from '../data/sections.js';
import { useLocalStorage, lsGet, lsSet } from '../hooks/useLocalStorage.js';

const APPLY_GROUPS = [
  { label: '→ Project Overview', ids: ['proj_data', 'est_basis', 'risks_opps'] },
  { label: '→ Estimate Basis', ids: ['est_general', 'disciplines', 'est_scas'] },
  { label: '→ Cost Sections', ids: ['hl_summary', 'exec_cost', 'sensitivity'] },
  { label: '→ Schedule', ids: ['sched_basis', 'sched_metrics', 'sched_l1'] },
  { label: '→ Risk & AQE', ids: ['risks_opps', 'contingency', 'risk_assess', 'aqe'] },
  { label: '→ Construction', ids: ['unit_rates', 'labor_strategy', 'indirects', 'prof_svcs'] },
  { label: '→ Execution', ids: ['exec_plan', 'exec_cost', 'currency'] },
];

export default function NotesDrawer({ open, onClose, onStatus }) {
  const [notes, setNotes] = useLocalStorage('estimatorNotes', '');
  const taRef = useRef(null);

  function applyTo(ids) {
    const v = notes.trim();
    if (!v) {
      alert('Please add notes to the Estimator Notes drawer first.');
      return;
    }
    let ct = 0;
    ids.forEach(id => {
      if (!lsGet('bd_' + id)) {
        lsSet('bd_' + id, v);
        ct++;
      }
    });
    onStatus?.(`Notes applied to ${ct} slides`);
  }

  function applyAll() {
    const v = notes.trim();
    if (!v) {
      alert('Please add notes first.');
      return;
    }
    allSlides.forEach(sl => {
      if (!lsGet('bd_' + sl.id)) lsSet('bd_' + sl.id, v);
    });
    onStatus?.('Notes applied to all slides');
    onClose();
  }

  return (
    <div className={`notes-drawer${open ? ' open' : ''}`}>
      <div className="nd-hdr">
        <span style={{ fontSize: 16 }}>⚡</span>
        <span className="nd-hdr-title">Estimator Notes</span>
        <button className="nd-close" onClick={onClose}>✕</button>
      </div>
      <div className="nd-body">
        <textarea
          id="estimatorNotes"
          ref={taRef}
          className="nd-ta"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder={
            'Brain dump everything here — project details, cost drivers, schedule constraints, scope notes, open items, risks, assumptions, rough numbers...\n\nAI will pull from these notes when you hit ⚡ Generate on any slide. Use the buttons on the right to push your notes into specific sections.'
          }
        />
        <div className="nd-side">
          <div className="nd-side-lbl">Apply Notes To</div>
          {APPLY_GROUPS.map(g => (
            <button key={g.label} className="nd-btn" onClick={() => applyTo(g.ids)}>
              {g.label}
            </button>
          ))}
        </div>
      </div>
      <div className="nd-footer">
        <button className="nd-apply-all" onClick={applyAll}>⚡ Apply to All Slides</button>
      </div>
    </div>
  );
}
