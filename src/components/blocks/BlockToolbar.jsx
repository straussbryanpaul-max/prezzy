export default function BlockToolbar({ onAdd, onClose }) {
  return (
    <div className="block-toolbar">
      <span className="block-toolbar-label">Add Block</span>
      <button className="tb-add-btn" onClick={() => onAdd('heading')}>🔤 Heading</button>
      <button className="tb-add-btn" onClick={() => onAdd('text')}>📝 Text</button>
      <button className="tb-add-btn" onClick={() => onAdd('field')}>📋 Field</button>
      <button className="tb-add-btn" onClick={() => onAdd('formsection')}>🗂 Form Section</button>
      <button className="tb-add-btn" onClick={() => onAdd('table')}>📊 Table</button>
      <div className="tb-divider" />
      <button className="tb-add-btn" onClick={() => onAdd('image')}>🖼️ Image</button>
      <button className="tb-add-btn" onClick={() => onAdd('file')}>📎 File</button>
      <button className="tb-add-btn" onClick={() => onAdd('pbi')}>⚡ Power BI</button>
      <button className="tb-add-btn" onClick={() => onAdd('shape')}>🎨 Shape</button>
      <div className="tb-divider" />
      <button className="tb-add-btn" style={{ color: 'rgba(255,255,255,.4)', fontSize: 11 }} onClick={onClose}>
        ✕ Close
      </button>
    </div>
  );
}
