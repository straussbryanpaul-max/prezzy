export default function AIPanel({ open, onClose }) {
  return (
    <div className={`ai-panel${open ? ' open' : ''}`}>
      <button className="close-ai" onClick={onClose}>✕</button>
      <h3>🤖 AI Assistant</h3>
      <div className="form-group">
        <label>API Token</label>
        <input
          type="password"
          placeholder="Enter your OpenAI/Azure API key"
          onChange={e => {
            window._apiKey = e.target.value;
          }}
        />
      </div>
      <div className="form-group">
        <label>Upload Documents</label>
        <div className="img-upload" style={{ padding: 20 }}>
          <div className="icon">📎</div>
          <p>Drop SOWs, estimate docs, specs here</p>
          <input type="file" multiple />
        </div>
      </div>
      <div className="form-group">
        <label>Global Brain Dump</label>
        <textarea
          rows={6}
          placeholder="Paste everything you know about this estimate — project background, scope notes, key decisions, rough numbers, anything. AI will parse and distribute across relevant slides..."
        />
      </div>
      <button
        style={{
          width: '100%',
          padding: 12,
          background: 'linear-gradient(135deg, var(--teal), var(--blue))',
          color: 'white',
          border: 'none',
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        ⚡ Auto-Fill from Documents & Notes
      </button>
      <p style={{ fontSize: 11, color: 'var(--gray3)', marginTop: 12, textAlign: 'center' }}>
        AI will scrape uploaded documents and your brain dump to intelligently populate slide fields.
      </p>
    </div>
  );
}
