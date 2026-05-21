import { useRef, useState } from 'react';
import { allSlides } from '../data/sections.js';
import { useLocalStorage, lsGet, lsSet } from '../hooks/useLocalStorage.js';
import { exportFormalBasis } from '../services/exportBasis.js';

const PUSH_GROUPS = [
  { label: '→ Project Overview', ids: ['proj_data', 'est_basis', 'risks_opps'] },
  { label: '→ Estimate Basis', ids: ['est_general', 'disciplines', 'est_scas'] },
  { label: '→ Cost Sections', ids: ['hl_summary', 'exec_cost', 'sensitivity'] },
  { label: '→ Schedule', ids: ['sched_basis', 'sched_metrics', 'sched_l1'] },
  { label: '→ Risk & AQE', ids: ['risks_opps', 'contingency', 'risk_assess', 'aqe'] },
  { label: '→ Construction', ids: ['unit_rates', 'labor_strategy', 'indirects', 'prof_svcs'] },
  { label: '→ Execution', ids: ['exec_plan', 'exec_cost', 'currency'] },
];

function fmtSize(size) {
  return size > 1048576 ? (size / 1048576).toFixed(1) + 'MB' : Math.round(size / 1024) + 'KB';
}

export default function AIPanel({ open, onClose, onStatus }) {
  const [notes, setNotes] = useLocalStorage('estimatorNotes', '');
  const [files, setFiles] = useState([]);
  const [extractInstr, setExtractInstr] = useLocalStorage(
    'ai_extract_instr',
    'Extract project name, client, location, estimate class, total cost, key risks, and assumptions.'
  );
  const [over, setOver] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const fileInputRef = useRef(null);

  function addFiles(list) {
    setFiles(prev => [...prev, ...Array.from(list)]);
  }

  function removeFile(i) {
    setFiles(prev => prev.filter((_, idx) => idx !== i));
  }

  function pushNotesTo(ids) {
    const v = notes.trim();
    if (!v) {
      alert('Add some notes first.');
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

  function pushNotesToAll() {
    const v = notes.trim();
    if (!v) {
      alert('Add some notes first.');
      return;
    }
    allSlides.forEach(sl => {
      if (!lsGet('bd_' + sl.id)) lsSet('bd_' + sl.id, v);
    });
    onStatus?.('Notes applied to all slides');
  }

  async function analyzeDocuments() {
    if (!files.length) {
      alert('Upload at least one document first.');
      return;
    }
    setAnalyzing(true);
    onStatus?.('Analyzing documents...', 'var(--orange)');
    const apiKey = window._apiKey || '';
    if (!apiKey) {
      await new Promise(r => setTimeout(r, 1200));
      onStatus?.('Demo mode — add API key in top bar for real extraction.');
      setAnalyzing(false);
      return;
    }
    try {
      const texts = await Promise.all(files.map(f => f.text().catch(() => '(binary)')));
      const content = files
        .map((f, i) => `FILE: ${f.name}\n${texts[i].substring(0, 2500)}`)
        .join('\n\n---\n\n');
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5',
          max_tokens: 800,
          messages: [
            {
              role: 'user',
              content:
                extractInstr +
                '\n\nDocuments:\n' +
                content +
                '\n\nReturn JSON only (no markdown): {"projectName":"","clientName":"","location":"","estClass":"","totalCost":"","keyRisks":"","assumptions":""}',
            },
          ],
        }),
      });
      if (!res.ok) throw new Error('API ' + res.status);
      const data = await res.json();
      const txt = data.content?.map(c => c.text || '').join('') || '{}';
      const p = JSON.parse(txt.replace(/```json|```/g, '').trim());
      if (p.projectName) lsSet('f_project_name', p.projectName);
      if (p.clientName) lsSet('f_client_name', p.clientName);
      if (p.location) lsSet('f_location', p.location);
      if (p.keyRisks) lsSet('f_risks', p.keyRisks);
      if (p.assumptions) lsSet('f_aqe_0', p.assumptions);
      onStatus?.('AI extracted data and populated slides ✓');
    } catch (e) {
      onStatus?.('Extraction error: ' + e.message, 'var(--red)');
    }
    setAnalyzing(false);
  }

  async function createFormalBasis() {
    setExporting(true);
    try {
      await exportFormalBasis({ onStatus });
    } catch (e) {
      onStatus?.('Export failed: ' + e.message, 'var(--red)');
    }
    setExporting(false);
  }

  return (
    <div className={`ai-panel ai-panel-wide${open ? ' open' : ''}`}>
      <button className="close-ai" onClick={onClose}>✕</button>
      <h3>🤖 AI Hub</h3>

      <div className="ai-section">
        <div className="ai-section-label">📎 Source Documents</div>
        <div
          className={`ai-drop${over ? ' over' : ''}`}
          onDrop={e => {
            e.preventDefault();
            setOver(false);
            addFiles(e.dataTransfer.files);
          }}
          onDragOver={e => {
            e.preventDefault();
            setOver(true);
          }}
          onDragLeave={() => setOver(false)}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="dico">📂</div>
          <p><span>Browse</span> or drop files</p>
          <p className="ai-drop-sub">PDF · XLSX · DOCX · CSV · PNG · JPG</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          style={{ display: 'none' }}
          multiple
          onChange={e => addFiles(e.target.files)}
        />
        {files.length > 0 && (
          <div className="ai-file-list">
            {files.map((f, i) => (
              <div key={i} className="ai-file-row">
                <span>📄</span>
                <span className="fn">{f.name}</span>
                <span className="fs">{fmtSize(f.size)}</span>
                <button onClick={() => removeFile(i)}>✕</button>
              </div>
            ))}
          </div>
        )}
        <textarea
          className="ai-extract-instr"
          rows={2}
          value={extractInstr}
          onChange={e => setExtractInstr(e.target.value)}
          placeholder="What should AI look for in these documents?"
        />
        <button className="ai-action-btn" onClick={analyzeDocuments} disabled={analyzing}>
          {analyzing ? '⏳ Analyzing…' : '⚡ Analyze Docs & Auto-Fill Fields'}
        </button>
      </div>

      <div className="ai-section">
        <div className="ai-section-label">📝 Project Notes (brain dump)</div>
        <textarea
          className="ai-notes"
          rows={8}
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Brain dump everything — project details, cost drivers, schedule constraints, scope notes, open items, rough numbers… AI uses these when you click Generate on any slide, or when you create the formal basis."
          id="estimatorNotes"
        />

        <div className="ai-section-sublabel">⚡ Push Notes To Slides</div>
        <div className="ai-push-grid">
          {PUSH_GROUPS.map(g => (
            <button key={g.label} className="ai-push-btn" onClick={() => pushNotesTo(g.ids)}>
              {g.label}
            </button>
          ))}
        </div>
        <button className="ai-action-btn alt" onClick={pushNotesToAll}>
          ⚡ Apply Notes to All Slides
        </button>
      </div>

      <div className="ai-section">
        <div className="ai-section-label">📄 Generate Document</div>
        <p className="ai-help-text">
          Reads every brain dump and form field in the presentation, asks AI to draft a polished
          Basis of Estimate narrative, and downloads it as a Word document.
        </p>
        <button className="ai-action-btn primary" onClick={createFormalBasis} disabled={exporting}>
          {exporting ? '⏳ Drafting BOE…' : '📑 Create Formal Basis (Word)'}
        </button>
      </div>
    </div>
  );
}
