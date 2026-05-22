import { useState } from 'react';
import { lsGet, lsSetAndNotify } from '../hooks/useLocalStorage.js';

const TARGET_KEY = 'f_safety_topic';

export default function SafetyGenerator() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);

  async function generate() {
    const t = topic.trim();
    if (!t) {
      alert('Type a topic or keyword first (e.g. "scaffold safety", "heat illness", "hand pinch points").');
      return;
    }

    const existing = lsGet(TARGET_KEY, '');
    if (existing && !confirm('There is already content in the Safety Moment Topic field. Replace it?')) {
      return;
    }

    setLoading(true);
    const apiKey = window._apiKey || '';

    const prompt = `You are writing the opening "Safety Moment" for a construction project's estimate review meeting.

Topic seed: "${t}"

Write a professional safety moment in 2–3 short paragraphs (under 200 words total):
1. One paragraph framing the hazard or topic
2. One paragraph with specific actionable behaviors or controls
3. Close with a single-line "Key takeaway:" callout

Third person, plain prose, no bullets, no headings, no markdown. Suitable to read aloud at the start of a review.`;

    let text = '';
    try {
      if (!apiKey) {
        await new Promise(r => setTimeout(r, 800));
        text = `[DEMO MODE — Configure an API key (via the developer's backend) to enable real AI generation]

Safety Moment: ${t}

This is a placeholder safety moment about ${t}. In a real construction environment, particular attention should be paid to proper PPE, situational awareness, hazard identification, and following established procedures. Crews should review the relevant Job Hazard Analysis before starting work and confirm that all controls are in place.

Supervisors should reinforce stop-work authority for any team member who identifies an unsafe condition, and lessons learned from any near-miss should be captured and shared promptly across the project.

Key takeaway: Slow down, look around, and speak up — the schedule will wait, but a serious injury won't.`;
      } else {
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
            max_tokens: 600,
            messages: [{ role: 'user', content: prompt }],
          }),
        });
        if (!res.ok) {
          const err = await res.text();
          throw new Error(`API ${res.status}: ${err.slice(0, 200)}`);
        }
        const data = await res.json();
        text = data.content?.map(c => c.text || '').join('') || '';
        if (!text) throw new Error('Empty AI response');
      }
      lsSetAndNotify(TARGET_KEY, text);
      setTopic('');
    } catch (e) {
      alert('Generation failed: ' + e.message);
    }
    setLoading(false);
  }

  return (
    <div className="safety-gen">
      <div className="safety-gen-label">⚡ Generate Safety Moment with AI</div>
      <div className="safety-gen-row">
        <input
          type="text"
          className="safety-gen-input"
          placeholder='Topic seed — e.g. "scaffold falls", "heat illness in summer", "fatigue management"'
          value={topic}
          onChange={e => setTopic(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              generate();
            }
          }}
          disabled={loading}
        />
        <button
          type="button"
          className="safety-gen-btn"
          onClick={generate}
          disabled={loading}
        >
          {loading ? '⏳ Generating…' : '⚡ Generate'}
        </button>
      </div>
      <p className="safety-gen-help">
        AI writes 2–3 paragraphs based on your topic and fills the Safety Moment Topic field below.
        Edit freely after.
      </p>
    </div>
  );
}
