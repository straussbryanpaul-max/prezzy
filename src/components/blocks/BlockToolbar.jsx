export default function BlockToolbar({ onAdd, onClose }) {
  return (
    <div className="block-toolbar">
      <span className="block-toolbar-label">Add Block</span>
      <button className="tb-add-btn" onClick={() => onAdd('text')}>📝 Text</button>
      <button className="tb-add-btn" onClick={() => onAdd('table')}>📊 Table</button>
      <button className="tb-add-btn" onClick={() => onAdd('image')}>🖼️ Image</button>
      <button className="tb-add-btn" onClick={() => onAdd('file')}>📎 File Upload</button>
      <button className="tb-add-btn" onClick={() => onAdd('pbi')}>⚡ Power BI</button>
      <button className="tb-add-btn" onClick={() => onAdd('shape')}>🎨 Shape / Art</button>
      <div className="tb-divider"></div>
      <button className="tb-add-btn" style={{ color: 'rgba(255,255,255,.4)', fontSize: 11 }} onClick={onClose}>
        ✕ Close
      </button>
    </div>
  );
}
