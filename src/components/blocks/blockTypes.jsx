import { useState, useRef } from 'react';

// ─── TEXT BLOCK ──────────────────────────────────────────────────────────────

export function TextBlock({ block, onUpdate }) {
  return (
    <div className="mod-text-wrap">
      <input
        className="mod-text-label"
        placeholder="Label (optional)"
        defaultValue={block.data?.label || ''}
        onChange={e => onUpdate(block.id, { label: e.target.value })}
      />
      <textarea
        rows={4}
        placeholder="Enter text, narrative, notes..."
        defaultValue={block.data?.text || ''}
        onChange={e => onUpdate(block.id, { text: e.target.value })}
      />
    </div>
  );
}

// ─── HEADING BLOCK ───────────────────────────────────────────────────────────

export function HeadingBlock({ block, onUpdate }) {
  return (
    <div className="mod-heading-wrap">
      <input
        className="mod-heading-input"
        placeholder="Section heading…"
        defaultValue={block.data?.text || ''}
        onChange={e => onUpdate(block.id, { text: e.target.value })}
      />
    </div>
  );
}

// ─── FIELD BLOCK ─────────────────────────────────────────────────────────────

const FIELD_TYPES = [
  { key: 'text',     icon: 'Aa', label: 'Text' },
  { key: 'number',   icon: '#',  label: 'Number' },
  { key: 'date',     icon: '📅', label: 'Date' },
  { key: 'dropdown', icon: '▾',  label: 'Dropdown' },
];

export function FieldBlock({ block, onUpdate }) {
  const data = block.data || {};
  const type = data.type || 'text';
  const options = data.options || '';
  const parsedOptions = options.split('\n').map(o => o.trim()).filter(Boolean);

  function update(patch) {
    onUpdate(block.id, { ...data, ...patch });
  }

  return (
    <div className="mod-field-wrap">
      <div className="mod-field-header">
        <input
          className="mod-field-label-input"
          placeholder="Field label…"
          defaultValue={data.label || ''}
          onChange={e => update({ label: e.target.value })}
        />
        <div className="mod-field-type-row">
          {FIELD_TYPES.map(t => (
            <button
              key={t.key}
              className={`mod-field-type-btn${type === t.key ? ' active' : ''}`}
              onClick={() => update({ type: t.key })}
              title={t.label}
            >
              {t.icon}
            </button>
          ))}
        </div>
      </div>

      {type === 'dropdown' && (
        <div className="mod-field-opts">
          <div className="mod-field-opts-label">Dropdown options — one per line</div>
          <textarea
            className="mod-field-opts-ta"
            rows={3}
            value={options}
            onChange={e => update({ options: e.target.value })}
            placeholder={'Option A\nOption B\nOption C'}
          />
        </div>
      )}

      <div className="mod-field-value-wrap">
        {type === 'text' && (
          <input
            type="text"
            className="mod-field-input"
            placeholder={data.placeholder || 'Enter value…'}
            value={data.value || ''}
            onChange={e => update({ value: e.target.value })}
          />
        )}
        {type === 'number' && (
          <input
            type="number"
            className="mod-field-input"
            placeholder={data.placeholder || '0'}
            value={data.value || ''}
            onChange={e => update({ value: e.target.value })}
          />
        )}
        {type === 'date' && (
          <input
            type="date"
            className="mod-field-input"
            value={data.value || ''}
            onChange={e => update({ value: e.target.value })}
          />
        )}
        {type === 'dropdown' && (
          <select
            className="mod-field-select"
            value={data.value || ''}
            onChange={e => update({ value: e.target.value })}
          >
            <option value="">— Select —</option>
            {parsedOptions.map((o, i) => (
              <option key={i} value={o}>{o}</option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}

// ─── TABLE BLOCK ─────────────────────────────────────────────────────────────

function defaultHeaders(n) {
  return Array.from({ length: n }, (_, i) => `Column ${i + 1}`);
}
function emptyCells(rows, cols) {
  return Array.from({ length: rows }, () => Array(cols).fill(''));
}

const COL_TYPES = [
  { key: 'text',     label: 'Aa' },
  { key: 'number',   label: '#' },
  { key: 'date',     label: '📅' },
  { key: 'dropdown', label: '▾' },
];

export function TableBlock({ block, onUpdate }) {
  const initCols = block.data?.cols || 3;
  const initHeaders = block.data?.headers || defaultHeaders(initCols);

  const [headers, setHeaders] = useState(initHeaders);
  const [cells, setCells]     = useState(block.data?.cells || emptyCells(block.data?.rows || 4, initCols));
  const [colTypes, setColTypes]   = useState(block.data?.colTypes   || initHeaders.map(() => 'text'));
  const [colOptions, setColOptions] = useState(block.data?.colOptions || initHeaders.map(() => ''));
  const [editingOpts, setEditingOpts] = useState(null); // column index with opts panel open

  function persist(h, c, ct, co) {
    onUpdate(block.id, {
      headers: h, cells: c, rows: c.length, cols: h.length,
      colTypes: ct, colOptions: co,
    });
  }

  function addRow() {
    const next = [...cells, Array(headers.length).fill('')];
    setCells(next); persist(headers, next, colTypes, colOptions);
  }

  function removeRow(idx) {
    if (cells.length <= 1) return;
    if (cells[idx]?.some(v => v?.trim()) && !confirm('This row has content. Delete anyway?')) return;
    const next = cells.filter((_, i) => i !== idx);
    setCells(next); persist(headers, next, colTypes, colOptions);
  }

  function addCol() {
    const nh = [...headers, `Column ${headers.length + 1}`];
    const nc = cells.map(row => [...row, '']);
    const nct = [...colTypes, 'text'];
    const nco = [...colOptions, ''];
    setHeaders(nh); setCells(nc); setColTypes(nct); setColOptions(nco);
    persist(nh, nc, nct, nco);
  }

  function removeCol(idx) {
    if (headers.length <= 1) return;
    const hasContent = cells.some(row => row[idx]?.trim());
    if (hasContent && !confirm(`Delete column "${headers[idx]}"?`)) return;
    const nh = headers.filter((_, i) => i !== idx);
    const nc = cells.map(row => row.filter((_, i) => i !== idx));
    const nct = colTypes.filter((_, i) => i !== idx);
    const nco = colOptions.filter((_, i) => i !== idx);
    setHeaders(nh); setCells(nc); setColTypes(nct); setColOptions(nco);
    if (editingOpts === idx) setEditingOpts(null);
    persist(nh, nc, nct, nco);
  }

  function setHeader(idx, val) {
    const next = headers.map((h, i) => (i === idx ? val : h));
    setHeaders(next); persist(next, cells, colTypes, colOptions);
  }

  function setCell(r, c, val) {
    const next = cells.map((row, i) => i === r ? row.map((v, j) => j === c ? val : v) : row);
    setCells(next); persist(headers, next, colTypes, colOptions);
  }

  function setColType(idx, t) {
    const next = colTypes.map((ct, i) => i === idx ? t : ct);
    setColTypes(next); persist(headers, cells, next, colOptions);
    if (t !== 'dropdown' && editingOpts === idx) setEditingOpts(null);
  }

  function setColOpts(idx, val) {
    const next = colOptions.map((o, i) => i === idx ? val : o);
    setColOptions(next); persist(headers, cells, colTypes, next);
  }

  function renderCell(r, c) {
    const t   = colTypes[c] || 'text';
    const val = cells[r][c] ?? '';
    if (t === 'number') return (
      <input type="number" value={val} onChange={e => setCell(r, c, e.target.value)} />
    );
    if (t === 'date') return (
      <input type="date" value={val} onChange={e => setCell(r, c, e.target.value)} />
    );
    if (t === 'dropdown') {
      const opts = (colOptions[c] || '').split('\n').map(o => o.trim()).filter(Boolean);
      return (
        <select value={val} onChange={e => setCell(r, c, e.target.value)}>
          <option value="">—</option>
          {opts.map((o, i) => <option key={i} value={o}>{o}</option>)}
        </select>
      );
    }
    return <input type="text" placeholder="—" value={val} onChange={e => setCell(r, c, e.target.value)} />;
  }

  return (
    <div className="mod-table-wrap">
      {editingOpts !== null && (
        <div className="mod-table-opts-panel">
          <div className="mod-table-opts-header">
            <strong>Dropdown options — "{headers[editingOpts]}"</strong>
            <span className="mod-table-opts-hint">one per line</span>
            <button onClick={() => setEditingOpts(null)} title="Close">✕</button>
          </div>
          <textarea
            className="mod-table-opts-ta"
            rows={5}
            placeholder={'Option A\nOption B\nOption C'}
            value={colOptions[editingOpts] || ''}
            onChange={e => setColOpts(editingOpts, e.target.value)}
          />
        </div>
      )}
      <table className="mod-table">
        <thead>
          <tr>
            <th className="mod-table-row-gutter" />
            {headers.map((h, c) => (
              <th key={c} className="mod-table-col-head">
                <input
                  className="mod-table-header-input"
                  type="text"
                  value={h}
                  onChange={e => setHeader(c, e.target.value)}
                />
                <div className="mod-table-col-type-bar">
                  {COL_TYPES.map(t => (
                    <button
                      key={t.key}
                      className={`mod-table-col-type-btn${(colTypes[c] || 'text') === t.key ? ' active' : ''}`}
                      onClick={() => setColType(c, t.key)}
                      title={`Column type: ${t.key}`}
                    >
                      {t.label}
                    </button>
                  ))}
                  {(colTypes[c] || 'text') === 'dropdown' && (
                    <button
                      className={`mod-table-col-opts-btn${editingOpts === c ? ' active' : ''}`}
                      onClick={() => setEditingOpts(editingOpts === c ? null : c)}
                      title="Edit dropdown options"
                    >⚙</button>
                  )}
                </div>
                <button
                  type="button"
                  className="mod-table-del-col"
                  onClick={() => removeCol(c)}
                  disabled={headers.length <= 1}
                  title={headers.length <= 1 ? 'At least one column required' : `Delete "${h}"`}
                >×</button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cells.map((row, r) => (
            <tr key={r}>
              <td className="mod-table-row-gutter">
                <button
                  type="button"
                  className="mod-table-del-row"
                  onClick={() => removeRow(r)}
                  disabled={cells.length <= 1}
                >×</button>
              </td>
              {row.map((_, c) => (
                <td key={c}>{renderCell(r, c)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="tbl-footer">
        <button className="tbl-btn" onClick={addRow}>+ Row</button>
        <button className="tbl-btn" onClick={addCol}>+ Column</button>
      </div>
    </div>
  );
}

// ─── IMAGE / FILE / POWERBI / SHAPE ──────────────────────────────────────────
// (unchanged from original)

const IMG_SIZE_PCT = { sm: '25%', md: '50%', lg: '75%', full: '100%' };
const ALIGN_MAP    = { left: 'flex-start', center: 'center', right: 'flex-end' };

export function ImageBlock({ block, onUpdate }) {
  const [src, setSrc]           = useState(block.data?.src || '');
  const [imgSize, setImgSize]   = useState(block.data?.imgSize || 'full');
  const [imgAlign, setImgAlign] = useState(block.data?.imgAlign || 'center');
  const [focused, setFocused]   = useState(false);
  const inputRef = useRef(null);
  const wrapRef  = useRef(null);

  function persist(patch) { onUpdate(block.id, { src, imgSize, imgAlign, ...patch }); }

  function loadFile(file) {
    if (!file) return;
    const r = new FileReader();
    r.onload = ev => { setSrc(ev.target.result); persist({ src: ev.target.result }); };
    r.readAsDataURL(file);
  }

  function onChange(e) { loadFile(e.target.files?.[0]); }

  function onPaste(e) {
    for (const item of (e.clipboardData?.items || [])) {
      if (item.type.startsWith('image/')) {
        e.preventDefault(); e.stopPropagation();
        loadFile(item.getAsFile()); return;
      }
    }
  }

  function clearImage(e) {
    e.stopPropagation();
    if (!confirm('Remove this image?')) return;
    setSrc(''); persist({ src: '' });
  }

  function setSize(s, e)  { e.stopPropagation(); setImgSize(s);  persist({ imgSize: s }); }
  function setAlign(a, e) { e.stopPropagation(); setImgAlign(a); persist({ imgAlign: a }); }

  return (
    <div
      ref={wrapRef}
      className={`mod-img-wrap${src ? ' has-image' : ''}${focused ? ' focused' : ''}`}
      tabIndex={0}
      style={src ? { justifyContent: ALIGN_MAP[imgAlign] || 'center' } : undefined}
      onClick={() => { wrapRef.current?.focus(); if (!src) inputRef.current?.click(); }}
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
                <button key={s} type="button" className={`img-tb-btn${imgSize === s ? ' active' : ''}`} onClick={e => setSize(s, e)} title={`Size: ${s === 'sm' ? '25%' : s === 'md' ? '50%' : s === 'lg' ? '75%' : '100%'}`}>
                  {s === 'full' ? 'L' : s === 'lg' ? 'M' : s === 'md' ? 'S' : 'XS'}
                </button>
              ))}
            </div>
            <div className="img-tb-sep" />
            <div className="img-tb-group">
              <button type="button" className={`img-tb-btn${imgAlign === 'left'   ? ' active' : ''}`} onClick={e => setAlign('left',   e)} title="Align left">⇤</button>
              <button type="button" className={`img-tb-btn${imgAlign === 'center' ? ' active' : ''}`} onClick={e => setAlign('center', e)} title="Center">↔</button>
              <button type="button" className={`img-tb-btn${imgAlign === 'right'  ? ' active' : ''}`} onClick={e => setAlign('right',  e)} title="Align right">⇥</button>
            </div>
          </div>
          <button type="button" className="img-upload-clear"   onClick={clearImage} title="Remove image">✕ Remove</button>
          <button type="button" className="img-upload-replace" onClick={e => { e.stopPropagation(); inputRef.current?.click(); }} title="Replace image">↻ Replace</button>
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
  const [over, setOver]   = useState(false);
  const inputRef = useRef(null);

  function addFiles(list) { setFiles(prev => [...prev, ...Array.from(list)]); }
  function removeFile(i)  { setFiles(prev => prev.filter((_, idx) => idx !== i)); }

  return (
    <div className="mod-file-wrap">
      <div
        className={`mod-file-drop${over ? ' over' : ''}`}
        onDrop={e => { e.preventDefault(); setOver(false); addFiles(e.dataTransfer.files); }}
        onDragOver={e => { e.preventDefault(); setOver(true); }}
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

const PBI_RATIOS = { '16:9': 16 / 9, '4:3': 4 / 3, '21:9': 21 / 9, square: 1 };

export function PowerBIBlock({ block, onUpdate }) {
  const [url, setUrl]               = useState(block.data?.url || '');
  const [loadedUrl, setLoadedUrl]   = useState(block.data?.url || '');
  const [ratio, setRatio]           = useState(block.data?.ratio || '16:9');
  const [customHeight, setCustomHeight] = useState(block.data?.customHeight || 480);
  const [useCustom, setUseCustom]   = useState(block.data?.useCustom || false);
  const [showSettings, setShowSettings] = useState(false);
  const wrapRef = useRef(null);

  function persist(patch) { onUpdate(block.id, { url, ratio, customHeight, useCustom, ...patch }); }

  function preview() { if (!url) return; setLoadedUrl(url); persist({}); }
  function clearEmbed() {
    if (!confirm('Clear this Power BI embed?')) return;
    setUrl(''); setLoadedUrl(''); persist({ url: '' });
  }
  function setRatioVal(r) { setRatio(r); setUseCustom(false); persist({ ratio: r, useCustom: false }); }
  function setHeight(h)   { setCustomHeight(h); setUseCustom(true); persist({ customHeight: h, useCustom: true }); }
  function fullscreen() {
    const f = wrapRef.current?.querySelector('iframe');
    if (!f) return;
    if (f.requestFullscreen) f.requestFullscreen();
    else if (f.webkitRequestFullscreen) f.webkitRequestFullscreen();
  }

  const frameStyle = useCustom ? { height: `${customHeight}px` } : { aspectRatio: `${PBI_RATIOS[ratio]}`, height: 'auto' };

  return (
    <div className="mod-pbi-wrap" ref={wrapRef}>
      <div className="pbi-header">
        <span className="pbi-title">⚡ Power BI Live Embed</span>
        <button className="pbi-cog" onClick={() => setShowSettings(s => !s)}>⚙ {showSettings ? 'Hide' : 'Settings'}</button>
      </div>
      <div className="pbi-input-row">
        <input type="text" placeholder="https://app.powerbi.com/reportEmbed?reportId=…" value={url} onChange={e => setUrl(e.target.value)} />
        <button onClick={preview}>▶ Preview</button>
      </div>
      {showSettings && (
        <div className="pbi-settings">
          <div className="pbi-settings-row">
            <span className="pbi-settings-label">Aspect ratio</span>
            <div className="pbi-ratio-btns">
              {Object.keys(PBI_RATIOS).map(r => (
                <button key={r} className={`pbi-ratio-btn${!useCustom && ratio === r ? ' active' : ''}`} onClick={() => setRatioVal(r)}>{r}</button>
              ))}
            </div>
          </div>
          <div className="pbi-settings-row">
            <span className="pbi-settings-label">Custom height (px)</span>
            <input type="number" className="pbi-height-input" value={customHeight} min={200} max={1200} step={20} onChange={e => setHeight(Number(e.target.value))} />
            <button className={`pbi-ratio-btn${useCustom ? ' active' : ''}`} onClick={() => { setUseCustom(true); persist({ useCustom: true }); }}>Use custom</button>
          </div>
          {loadedUrl && (
            <div className="pbi-settings-row">
              <button className="pbi-action-btn" onClick={fullscreen}>⛶ Fullscreen</button>
              <button className="pbi-action-btn danger" onClick={clearEmbed}>✕ Clear embed</button>
            </div>
          )}
        </div>
      )}
      <div className="pbi-embed-wrap">
        <div className="pbi-embed-frame" style={frameStyle}>
          {loadedUrl ? (
            <iframe src={loadedUrl} allowFullScreen frameBorder="0" style={{ width: '100%', height: '100%', border: 'none', display: 'block', pointerEvents: 'auto' }} />
          ) : (
            <div className="pbi-embed-ph">
              <div style={{ fontSize: 36, marginBottom: 8 }}>📊</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 6 }}>Paste a Power BI embed URL above</div>
              <div style={{ fontSize: 11, opacity: 0.7, lineHeight: 1.6, maxWidth: 320, textAlign: 'center' }}>
                Use the report's <strong>Publish to web</strong> URL or <strong>Embed for your organization</strong> link.
              </div>
            </div>
          )}
        </div>
        {loadedUrl && <PbiResizeHandle currentHeight={useCustom ? customHeight : null} onResize={h => setHeight(h)} frameRef={wrapRef} />}
      </div>
    </div>
  );
}

function PbiResizeHandle({ currentHeight, onResize, frameRef }) {
  const startRef = useRef(null);
  function onMouseDown(e) {
    e.preventDefault();
    const startY = e.clientY;
    const frame  = frameRef.current?.querySelector('.pbi-embed-frame');
    const startH = frame?.getBoundingClientRect().height || currentHeight || 400;
    function onMove(ev) { onResize(Math.max(180, Math.min(1500, Math.round(startH + ev.clientY - startY)))); }
    function onUp() {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.body.style.cursor = 'ns-resize';
    document.body.style.userSelect = 'none';
  }
  return (
    <div className="pbi-resize-handle" onMouseDown={onMouseDown} title="Drag to resize height">
      <div className="pbi-resize-grip">⋯</div>
    </div>
  );
}

export function ShapeBlock({ block }) {
  const { emoji, color } = block.data || {};
  return (
    <div className="mod-shape-wrap" style={{ background: color ? `${color}20` : 'transparent', borderRadius: 10, minHeight: color === '#fff' ? 100 : 120 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 64, lineHeight: 1 }}>{emoji}</div>
        <div
          contentEditable suppressContentEditableWarning
          style={{ marginTop: 8, fontSize: 13, color: color === '#fff' ? '#333' : color, fontWeight: 600, outline: 'none', minWidth: 60 }}
          onClick={e => e.stopPropagation()}
        >
          Label
        </div>
      </div>
    </div>
  );
}
