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

function defaultHeaders(n) {
  return Array.from({ length: n }, (_, i) => `Column ${i + 1}`);
}
function emptyCells(rows, cols) {
  return Array.from({ length: rows }, () => Array(cols).fill(''));
}

export function TableBlock({ block, onUpdate }) {
  const initRows = block.data?.rows || 4;
  const initCols = block.data?.cols || 3;
  const [headers, setHeaders] = useState(block.data?.headers || defaultHeaders(initCols));
  const [cells, setCells] = useState(block.data?.cells || emptyCells(initRows, initCols));

  function persist(nextHeaders, nextCells) {
    onUpdate(block.id, {
      headers: nextHeaders,
      cells: nextCells,
      rows: nextCells.length,
      cols: nextHeaders.length,
    });
  }

  function addRow() {
    const next = [...cells, Array(headers.length).fill('')];
    setCells(next);
    persist(headers, next);
  }

  function removeRow(idx) {
    if (cells.length <= 1) return;
    const hasContent = cells[idx]?.some(v => v && v.trim());
    if (hasContent && !confirm('This row has content. Delete anyway?')) return;
    const next = cells.filter((_, i) => i !== idx);
    setCells(next);
    persist(headers, next);
  }

  function addCol() {
    const nextHeaders = [...headers, `Column ${headers.length + 1}`];
    const nextCells = cells.map(row => [...row, '']);
    setHeaders(nextHeaders);
    setCells(nextCells);
    persist(nextHeaders, nextCells);
  }

  function removeCol(idx) {
    if (headers.length <= 1) return;
    const colHasContent = cells.some(row => row[idx] && row[idx].trim());
    const headerCustom = headers[idx] && headers[idx] !== `Column ${idx + 1}`;
    if ((colHasContent || headerCustom) && !confirm(`Delete column "${headers[idx]}"? Its contents will be lost.`)) return;
    const nextHeaders = headers.filter((_, i) => i !== idx);
    const nextCells = cells.map(row => row.filter((_, i) => i !== idx));
    setHeaders(nextHeaders);
    setCells(nextCells);
    persist(nextHeaders, nextCells);
  }

  function setHeader(idx, value) {
    const next = headers.map((h, i) => (i === idx ? value : h));
    setHeaders(next);
    persist(next, cells);
  }

  function setCell(r, c, value) {
    const next = cells.map((row, i) => (i === r ? row.map((v, j) => (j === c ? value : v)) : row));
    setCells(next);
    persist(headers, next);
  }

  return (
    <div className="mod-table-wrap">
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
                <button
                  type="button"
                  className="mod-table-del-col"
                  onClick={() => removeCol(c)}
                  disabled={headers.length <= 1}
                  title={headers.length <= 1 ? 'At least one column required' : 'Delete this column'}
                >
                  ×
                </button>
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
                  title={cells.length <= 1 ? 'At least one row required' : 'Delete this row'}
                >
                  ×
                </button>
              </td>
              {row.map((cell, c) => (
                <td key={c}>
                  <input
                    type="text"
                    placeholder="—"
                    value={cell}
                    onChange={e => setCell(r, c, e.target.value)}
                  />
                </td>
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

      <div className="pbi-embed-wrap">
        <div className="pbi-embed-frame" style={frameStyle}>
          {loadedUrl ? (
            <iframe
              src={loadedUrl}
              allowFullScreen
              frameBorder="0"
              style={{ width: '100%', height: '100%', border: 'none', display: 'block', pointerEvents: 'auto' }}
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
        {loadedUrl && (
          <PbiResizeHandle
            currentHeight={useCustom ? customHeight : null}
            onResize={h => setHeight(h)}
            frameRef={wrapRef}
          />
        )}
      </div>
    </div>
  );
}

function PbiResizeHandle({ currentHeight, onResize, frameRef }) {
  const startRef = useRef(null);

  function onMouseDown(e) {
    e.preventDefault();
    const startY = e.clientY;
    const frame = frameRef.current?.querySelector('.pbi-embed-frame');
    const startH = frame?.getBoundingClientRect().height || currentHeight || 400;
    startRef.current = { startY, startH };

    function onMove(ev) {
      const dy = ev.clientY - startY;
      const newH = Math.max(180, Math.min(1500, Math.round(startH + dy)));
      onResize(newH);
    }
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
