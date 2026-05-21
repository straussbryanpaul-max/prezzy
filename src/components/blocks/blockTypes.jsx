import { useState, useRef } from 'react';

export function TextBlock({ block, onUpdate }) {
  return (
    <div className="mod-text-wrap">
      <textarea
        rows={4}
        placeholder="Enter text, narrative, notes..."
        defaultValue={block.data?.text || ''}
        onChange={e => onUpdate(block.id, { text: e.target.value })}
      />
    </div>
  );
}

export function TableBlock({ block, onUpdate }) {
  const [rows, setRows] = useState(block.data?.rows || 4);
  const [cols, setCols] = useState(block.data?.cols || 3);
  const [headers, setHeaders] = useState(
    block.data?.headers || Array.from({ length: cols }, (_, i) => `Column ${i + 1}`)
  );

  function addRow() {
    setRows(r => r + 1);
    onUpdate(block.id, { rows: rows + 1, cols, headers });
  }
  function removeRow() {
    if (rows <= 1) return;
    setRows(r => r - 1);
    onUpdate(block.id, { rows: rows - 1, cols, headers });
  }
  function addCol() {
    const next = [...headers, 'Column'];
    setCols(c => c + 1);
    setHeaders(next);
    onUpdate(block.id, { rows, cols: cols + 1, headers: next });
  }
  function setHeader(i, v) {
    const next = [...headers];
    next[i] = v;
    setHeaders(next);
    onUpdate(block.id, { rows, cols, headers: next });
  }

  return (
    <div className="mod-table-wrap">
      <table className="mod-table">
        <thead>
          <tr>
            {Array.from({ length: cols }).map((_, c) => (
              <th
                key={c}
                contentEditable
                suppressContentEditableWarning
                onBlur={e => setHeader(c, e.target.textContent)}
              >
                {headers[c] || `Column ${c + 1}`}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r}>
              {Array.from({ length: cols }).map((_, c) => (
                <td key={c}>
                  <input type="text" placeholder="—" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="tbl-footer">
        <button className="tbl-btn" onClick={addRow}>+ Row</button>
        <button className="tbl-btn" onClick={addCol}>+ Column</button>
        <button className="tbl-btn" onClick={removeRow}>– Row</button>
      </div>
    </div>
  );
}

const IMG_SIZE_PCT = { sm: '25%', md: '50%', lg: '75%', full: '100%' };

export function ImageBlock({ block, onUpdate }) {
  const [src, setSrc] = useState(block.data?.src || '');
  const [imgSize, setImgSize] = useState(block.data?.imgSize || 'full');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const wrapRef = useRef(null);

  function loadFile(file) {
    if (!file) return;
    const r = new FileReader();
    r.onload = ev => {
      setSrc(ev.target.result);
      onUpdate(block.id, { src: ev.target.result, imgSize });
    };
    r.readAsDataURL(file);
  }

  function onChange(e) {
    loadFile(e.target.files?.[0]);
  }

  function onPaste(e) {
    const items = e.clipboardData?.items || [];
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        e.stopPropagation();
        loadFile(item.getAsFile());
        return;
      }
    }
  }

  function clearImage(e) {
    e.stopPropagation();
    if (!confirm('Remove this image?')) return;
    setSrc('');
    onUpdate(block.id, { src: '', imgSize });
  }

  function setSize(s, e) {
    e.stopPropagation();
    setImgSize(s);
    onUpdate(block.id, { src, imgSize: s });
  }

  return (
    <div
      ref={wrapRef}
      className={`mod-img-wrap${src ? ' has-image' : ''}${focused ? ' focused' : ''}`}
      tabIndex={0}
      onClick={() => {
        wrapRef.current?.focus();
        if (!src) inputRef.current?.click();
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onPaste={onPaste}
    >
      <input ref={inputRef} type="file" style={{ display: 'none' }} accept="image/*" onChange={onChange} />
      {src ? (
        <>
          <img
            src={src}
            alt="uploaded"
            style={{ width: IMG_SIZE_PCT[imgSize] || '100%' }}
          />
          <div className="img-size-bar">
            {['sm', 'md', 'lg', 'full'].map(s => (
              <button
                key={s}
                type="button"
                className={`img-size-btn${imgSize === s ? ' active' : ''}`}
                onClick={e => setSize(s, e)}
                title={`Image ${s === 'full' ? 'full width' : s.toUpperCase()}`}
              >
                {s === 'full' ? 'L' : s === 'lg' ? 'M' : s === 'md' ? 'S' : 'XS'}
              </button>
            ))}
          </div>
          <button type="button" className="img-upload-clear" onClick={clearImage} title="Remove image">
            ✕ Remove
          </button>
          <button
            type="button"
            className="img-upload-replace"
            onClick={e => { e.stopPropagation(); inputRef.current?.click(); }}
            title="Replace image"
          >
            ↻ Replace
          </button>
        </>
      ) : (
        <div className="img-placeholder">
          <div className="ico">🖼️</div>
          <p>Click to upload, or focus + paste (Ctrl/Cmd+V) a screenshot</p>
        </div>
      )}
    </div>
  );
}

function fmt(size) {
  return size > 1048576 ? (size / 1048576).toFixed(1) + 'MB' : Math.round(size / 1024) + 'KB';
}

export function FileBlock() {
  const [files, setFiles] = useState([]);
  const [over, setOver] = useState(false);
  const inputRef = useRef(null);

  function addFiles(list) {
    setFiles(prev => [...prev, ...Array.from(list)]);
  }
  function removeFile(i) {
    setFiles(prev => prev.filter((_, idx) => idx !== i));
  }

  return (
    <div className="mod-file-wrap">
      <div
        className={`mod-file-drop${over ? ' over' : ''}`}
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
        <div className="dico">📎</div>
        <p><strong>Click to browse</strong> or drag files here</p>
      </div>
      <input ref={inputRef} type="file" style={{ display: 'none' }} multiple onChange={e => addFiles(e.target.files)} />
      <div className="mod-file-list">
        {files.map((f, i) => (
          <div key={i} className="mod-file-item">
            <span>📄</span>
            <span className="fn">{f.name}</span>
            <span className="fs">{fmt(f.size)}</span>
            <button className="fx" onClick={() => removeFile(i)}>✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PowerBIBlock({ block, onUpdate }) {
  const [url, setUrl] = useState(block.data?.url || '');
  const [loadedUrl, setLoadedUrl] = useState(block.data?.url || '');

  function preview() {
    if (!url) return;
    setLoadedUrl(url);
    onUpdate(block.id, { url });
  }

  return (
    <div className="mod-pbi-wrap">
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--navy)', marginBottom: 8, letterSpacing: '.3px' }}>
        ⚡ POWER BI LIVE EMBED
      </div>
      <div className="pbi-input-row">
        <input
          type="text"
          placeholder="https://app.powerbi.com/reportEmbed?reportId=..."
          value={url}
          onChange={e => setUrl(e.target.value)}
        />
        <button onClick={preview}>▶ Preview</button>
      </div>
      <div className="pbi-embed-frame" style={{ minHeight: 200 }}>
        {loadedUrl ? (
          <iframe src={loadedUrl} allowFullScreen style={{ width: '100%', height: 280 }} />
        ) : (
          <div className="pbi-embed-ph">📊 Paste a Power BI embed URL above and click Preview</div>
        )}
      </div>
    </div>
  );
}

export function ShapeBlock({ block }) {
  const { emoji, color } = block.data || {};
  return (
    <div
      className="mod-shape-wrap"
      style={{
        background: color ? `${color}20` : 'transparent',
        borderRadius: 10,
        minHeight: color === '#fff' ? 100 : 120,
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 64, lineHeight: 1 }}>{emoji}</div>
        <div
          contentEditable
          suppressContentEditableWarning
          style={{
            marginTop: 8,
            fontSize: 13,
            color: color === '#fff' ? '#333' : color,
            fontWeight: 600,
            outline: 'none',
            minWidth: 60,
          }}
          onClick={e => e.stopPropagation()}
        >
          Label
        </div>
      </div>
    </div>
  );
}
