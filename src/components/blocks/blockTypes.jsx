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
const ALIGN_MAP = { left: 'flex-start', center: 'center', right: 'flex-end' };

export function ImageBlock({ block, onUpdate }) {
  const [src, setSrc] = useState(block.data?.src || '');
  const [imgSize, setImgSize] = useState(block.data?.imgSize || 'full');
  const [imgAlign, setImgAlign] = useState(block.data?.imgAlign || 'center');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const wrapRef = useRef(null);

  function persist(patch) {
    onUpdate(block.id, { src, imgSize, imgAlign, ...patch });
  }

  function loadFile(file) {
    if (!file) return;
    const r = new FileReader();
    r.onload = ev => {
      setSrc(ev.target.result);
      persist({ src: ev.target.result });
    };
    r.readAsDataURL(file);
  }

  function onChange(e) { loadFile(e.target.files?.[0]); }

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
    persist({ src: '' });
  }

  function setSize(s, e) { e.stopPropagation(); setImgSize(s); persist({ imgSize: s }); }
  function setAlign(a, e) { e.stopPropagation(); setImgAlign(a); persist({ imgAlign: a }); }

  return (
    <div
      ref={wrapRef}
      className={`mod-img-wrap${src ? ' has-image' : ''}${focused ? ' focused' : ''}`}
      tabIndex={0}
      style={src ? { justifyContent: ALIGN_MAP[imgAlign] || 'center' } : undefined}
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
          <img src={src} alt="uploaded" style={{ width: IMG_SIZE_PCT[imgSize] || '100%' }} />
          <div className="img-toolbar">
            <div className="img-tb-group">
              {['sm', 'md', 'lg', 'full'].map(s => (
                <button
                  key={s}
                  type="button"
                  className={`img-tb-btn${imgSize === s ? ' active' : ''}`}
                  onClick={e => setSize(s, e)}
                  title={`Size: ${s === 'sm' ? '25%' : s === 'md' ? '50%' : s === 'lg' ? '75%' : '100%'}`}
                >
                  {s === 'full' ? 'L' : s === 'lg' ? 'M' : s === 'md' ? 'S' : 'XS'}
                </button>
              ))}
            </div>
            <div className="img-tb-sep" />
            <div className="img-tb-group">
              <button type="button" className={`img-tb-btn${imgAlign === 'left' ? ' active' : ''}`} onClick={e => setAlign('left', e)} title="Align left">⇤</button>
              <button type="button" className={`img-tb-btn${imgAlign === 'center' ? ' active' : ''}`} onClick={e => setAlign('center', e)} title="Center">↔</button>
              <button type="button" className={`img-tb-btn${imgAlign === 'right' ? ' active' : ''}`} onClick={e => setAlign('right', e)} title="Align right">⇥</button>
            </div>
          </div>
          <button type="button" className="img-upload-clear" onClick={clearImage} title="Remove image">✕ Remove</button>
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

const PBI_RATIOS = {
  '16:9': 16 / 9,
  '4:3': 4 / 3,
  '21:9': 21 / 9,
  square: 1,
};

export function PowerBIBlock({ block, onUpdate }) {
  const [url, setUrl] = useState(block.data?.url || '');
  const [loadedUrl, setLoadedUrl] = useState(block.data?.url || '');
  const [ratio, setRatio] = useState(block.data?.ratio || '16:9');
  const [customHeight, setCustomHeight] = useState(block.data?.customHeight || 480);
  const [useCustom, setUseCustom] = useState(block.data?.useCustom || false);
  const [showSettings, setShowSettings] = useState(false);
  const wrapRef = useRef(null);

  function persist(patch) {
    onUpdate(block.id, { url, ratio, customHeight, useCustom, ...patch });
  }

  function preview() {
    if (!url) return;
    setLoadedUrl(url);
    persist({});
  }

  function clearEmbed() {
    if (!confirm('Clear this Power BI embed?')) return;
    setUrl('');
    setLoadedUrl('');
    persist({ url: '' });
  }

  function setRatioVal(r) { setRatio(r); setUseCustom(false); persist({ ratio: r, useCustom: false }); }
  function setHeight(h) { setCustomHeight(h); setUseCustom(true); persist({ customHeight: h, useCustom: true }); }

  function fullscreen() {
    const f = wrapRef.current?.querySelector('iframe');
    if (!f) return;
    if (f.requestFullscreen) f.requestFullscreen();
    else if (f.webkitRequestFullscreen) f.webkitRequestFullscreen();
  }

  // Calculate frame style based on aspect ratio or custom height
  const frameStyle = useCustom
    ? { height: `${customHeight}px` }
    : { aspectRatio: `${PBI_RATIOS[ratio]}`, height: 'auto' };

  return (
    <div className="mod-pbi-wrap" ref={wrapRef}>
      <div className="pbi-header">
        <span className="pbi-title">⚡ Power BI Live Embed</span>
        <button className="pbi-cog" onClick={() => setShowSettings(s => !s)} title="Display settings">
          ⚙ {showSettings ? 'Hide' : 'Settings'}
        </button>
      </div>

      <div className="pbi-input-row">
        <input
          type="text"
          placeholder="https://app.powerbi.com/reportEmbed?reportId=…  (or a publish-to-web URL)"
          value={url}
          onChange={e => setUrl(e.target.value)}
        />
        <button onClick={preview}>▶ Preview</button>
      </div>

      {showSettings && (
        <div className="pbi-settings">
          <div className="pbi-settings-row">
            <span className="pbi-settings-label">Aspect ratio</span>
            <div className="pbi-ratio-btns">
              {Object.keys(PBI_RATIOS).map(r => (
                <button
                  key={r}
                  className={`pbi-ratio-btn${!useCustom && ratio === r ? ' active' : ''}`}
                  onClick={() => setRatioVal(r)}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="pbi-settings-row">
            <span className="pbi-settings-label">Custom height (px)</span>
            <input
              type="number"
              className="pbi-height-input"
              value={customHeight}
              min={200}
              max={1200}
              step={20}
              onChange={e => setHeight(Number(e.target.value))}
            />
            <button
              className={`pbi-ratio-btn${useCustom ? ' active' : ''}`}
              onClick={() => { setUseCustom(true); persist({ useCustom: true }); }}
            >
              Use custom
            </button>
          </div>
          {loadedUrl && (
            <div className="pbi-settings-row">
              <button className="pbi-action-btn" onClick={fullscreen}>⛶ Fullscreen</button>
              <button className="pbi-action-btn danger" onClick={clearEmbed}>✕ Clear embed</button>
            </div>
          )}
        </div>
      )}

      <div className="pbi-embed-frame" style={frameStyle}>
        {loadedUrl ? (
          <iframe
            src={loadedUrl}
            allowFullScreen
            frameBorder="0"
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          />
        ) : (
          <div className="pbi-embed-ph">
            <div style={{ fontSize: 36, marginBottom: 8 }}>📊</div>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 6 }}>
              Paste a Power BI embed URL above
            </div>
            <div style={{ fontSize: 11, opacity: 0.7, lineHeight: 1.6, maxWidth: 320, textAlign: 'center' }}>
              Use the report's <strong>Publish to web</strong> URL or
              <strong> Embed for your organization</strong> link. Default aspect ratio is 16:9 — open Settings above to change it.
            </div>
          </div>
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
