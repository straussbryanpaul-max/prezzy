import { useRef, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';

const IMG_SIZE_PCT = { sm: '25%', md: '50%', lg: '75%', full: '100%' };
const ALIGN_MAP = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
};

export default function ImageUpload({ name }) {
  const [src, setSrc] = useLocalStorage('img_' + name, '');
  const [imgSize, setImgSize] = useLocalStorage('img_size_' + name, 'full');
  const [imgAlign, setImgAlign] = useLocalStorage('img_align_' + name, 'center');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const wrapRef = useRef(null);

  function loadFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setSrc(ev.target.result);
    reader.readAsDataURL(file);
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
  }

  function setSize(s, e) { e.stopPropagation(); setImgSize(s); }
  function setAlign(a, e) { e.stopPropagation(); setImgAlign(a); }

  const containerStyle = src
    ? { display: 'flex', justifyContent: ALIGN_MAP[imgAlign] || 'center' }
    : undefined;

  return (
    <div
      ref={wrapRef}
      className={`img-upload${src ? ' has-image' : ''}${focused ? ' focused' : ''}`}
      tabIndex={0}
      style={containerStyle}
      onClick={() => {
        wrapRef.current?.focus();
        if (!src) inputRef.current?.click();
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onPaste={onPaste}
    >
      <input ref={inputRef} type="file" accept="image/*" onChange={onChange} />
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
        <>
          <div className="icon">📸</div>
          <p>Click to upload, or focus + paste (Ctrl/Cmd+V) a screenshot</p>
        </>
      )}
    </div>
  );
}
