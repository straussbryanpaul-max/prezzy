import { useRef, useState } from 'react';
import { useLocalStorage, lsGet } from '../hooks/useLocalStorage.js';
import { allSlides } from '../data/sections.js';

export default function BrainDump({ slideId, onUseNarrative }) {
  const [open, setOpen] = useState(false);
  const [dump, setDump] = useLocalStorage('bd_' + slideId, '');
  const [aiText, setAiText] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapRef = useRef(null);

  function onContainerClick(e) {
    if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON') return;
    setOpen(o => !o);
  }

  async function runAI() {
    const notes = (document.getElementById('estimatorNotes')?.value || '').trim();
    if (!dump && !notes) {
      alert('Please add notes in the Brain Dump or Estimator Notes drawer first.');
      return;
    }
    setLoading(true);
    const sl = allSlides.find(s => s.id === slideId) || { title: slideId, num: '' };
    const proj = lsGet('f_project_name', 'the project');
    const apiKey = window._apiKey || '';

    const prompt = `You are an expert EPC construction estimator writing content for a formal management estimate review presentation.

Slide: "${sl.title}" (${sl.num})
Project: ${proj}

Estimator Notes:
${dump || '(none)'}

General Project Notes:
${notes || '(none)'}

Write formal, professional narrative for this slide as it would appear in a management review book. Third-person tone. Be specific with any data mentioned. Flag unconfirmed items with [TBD]. 200 words max.`;

    try {
      let text = '';
      if (!apiKey) {
        await new Promise(r => setTimeout(r, 900));
        text = `[DEMO MODE — Enter API key in top bar to enable real AI]

Based on the provided notes, the ${sl.title} reflects the following basis:

The estimate was developed in accordance with company estimating standards. Quantities were derived from the current 3D model with allowances applied for scope gaps and open items as documented in the AQE register (07.001).

All key assumptions and qualifications are documented. [TBD] — Confirm engineering % complete with discipline leads prior to final issue.`;
      } else {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 800,
            messages: [{ role: 'user', content: prompt }],
          }),
        });
        const data = await res.json();
        text = data.content?.map(c => c.text || '').join('') || 'No response received.';
      }
      setAiText(text);
      setShowResult(true);
      setOpen(true);
    } catch (e) {
      alert('AI error: ' + e.message);
    }
    setLoading(false);
  }

  function useNarrative() {
    if (onUseNarrative) onUseNarrative(aiText);
    setShowResult(false);
  }

  return (
    <div
      ref={wrapRef}
      className={`brain-dump${open ? ' open' : ''}`}
      onClick={onContainerClick}
    >
      <div className="bd-header">
        🧠 AI Brain Dump — paste rough notes, AI writes the formal narrative
      </div>
      {open && (
        <>
          <textarea
            placeholder="Drop rough notes here — numbers, bullet points, anything. AI converts to formal management narrative."
            value={dump}
            onChange={e => setDump(e.target.value)}
          />
          <button className="ai-btn" onClick={runAI} disabled={loading}>
            {loading ? '⏳ Generating…' : '⚡ Generate Narrative'}
          </button>
          {showResult && (
            <div className="ai-result-box show">
              <div className="air-hdr">
                ✨ AI Generated
                <div className="air-actions">
                  <button className="air-use" onClick={useNarrative}>
                    ✓ Use This
                  </button>
                  <button className="air-disc" onClick={() => setShowResult(false)}>
                    ✕ Discard
                  </button>
                </div>
              </div>
              <div className="air-text">{aiText}</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
