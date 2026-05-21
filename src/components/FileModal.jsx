import { useRef, useState } from 'react';
import { lsGet, lsSet } from '../hooks/useLocalStorage.js';

function fmt(size) {
  return size > 1048576 ? (size / 1048576).toFixed(1) + 'MB' : Math.round(size / 1024) + 'KB';
}

export default function FileModal({ open, onClose, onStatus }) {
  const [files, setFiles] = useState([]);
  const [instr, setInstr] = useState('');
  const [over, setOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  function addFiles(list) {
    setFiles(prev => [...prev, ...Array.from(list)]);
  }

  async function processFiles() {
    if (!files.length) {
      alert('Please upload at least one file.');
      return;
    }
    setLoading(true);
    onStatus?.('Analyzing documents...', 'var(--orange)');
    const apiKey = window._apiKey || '';
    if (!apiKey) {
      await new Promise(r => setTimeout(r, 1500));
      onStatus?.('Demo: Analysis complete. Add API key for real extraction.');
      setLoading(false);
      onClose();
      return;
    }
    try {
      const texts = await Promise.all(files.map(f => f.text().catch(() => '(binary)')));
      const content = files.map((f, i) => `FILE: ${f.name}\n${texts[i].substring(0, 2500)}`).join('\n\n---\n\n');
      const instruction = instr || 'Extract project name, client, location, estimate class, total cost, key risks, and assumptions.';
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 800,
          messages: [
            {
              role: 'user',
              content:
                instruction +
                '\n\nDocuments:\n' +
                content +
                '\n\nReturn JSON only (no markdown): {"projectName":"","clientName":"","location":"","estClass":"","totalCost":"","keyRisks":"","assumptions":""}',
            },
          ],
        }),
      });
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
      onStatus?.('Extraction error: ' + e.message);
    }
    setLoading(false);
    onClose();
  }

  if (!open) return null;

  return (
    <div className={`modal-bg${open ? ' open' : ''}`} onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-hdr">
          <h3>📎 AI Document Assistant</h3>
          <button className="modal-x" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 8, padding: '12px 16px', fontSize: 12, color: '#1E40AF' }}>
            💡 Upload any project document — estimates, SOWs, specs, schedules. AI extracts key data and auto-populates relevant slides.
          </div>
          <div
            className={`drop-zone${over ? ' over' : ''}`}
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
            onClick={() => inputRef.current?.click()}
          >
            <div className="dico">📂</div>
            <p><span>Browse files</span> or drag & drop here</p>
            <p style={{ fontSize: 11, marginTop: 4 }}>PDF · XLSX · DOCX · CSV · PNG · JPG</p>
          </div>
          <input ref={inputRef} type="file" style={{ display: 'none' }} multiple onChange={e => addFiles(e.target.files)} />
          <div className="file-list">
            {files.map((f, i) => (
              <div key={i} className="file-item">
                <span>📄</span>
                <span className="fi-name">{f.name}</span>
                <span className="fi-sz">{fmt(f.size)}</span>
                <span className="fi-ok">✓ Ready</span>
              </div>
            ))}
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--navy)', marginBottom: 6 }}>
              What should AI look for?
            </label>
            <textarea
              rows={3}
              value={instr}
              onChange={e => setInstr(e.target.value)}
              style={{ width: '100%', padding: 9, border: '1px solid var(--gray)', borderRadius: 7, fontSize: 13, fontFamily: 'inherit' }}
              placeholder="e.g. Extract cost totals, key milestones, estimate class, scope exclusions, and all assumptions."
            />
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-run" onClick={processFiles} disabled={loading}>
            {loading ? '⏳ Analyzing…' : '⚡ Analyze & Auto-Fill Slides'}
          </button>
        </div>
      </div>
    </div>
  );
}
