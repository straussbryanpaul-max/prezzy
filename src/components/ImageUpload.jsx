import { useRef, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';

export default function ImageUpload({ name }) {
  const [src, setSrc] = useLocalStorage('img_' + name, '');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const wrapRef = useRef(null);

  function loadFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setSrc(ev.target.result);
    reader.readAsDataURL(file);
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
  }

  return (
    <div
      ref={wrapRef}
      className={`img-upload${src ? ' has-image' : ''}${focused ? ' focused' : ''}`}
      tabIndex={0}
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
          <img src={src} alt="uploaded" />
          <button
            type="button"
            className="img-upload-clear"
            onClick={clearImage}
            title="Remove image (keeps the upload slot)"
          >
            ✕ Remove
          </button>
          <button
            type="button"
            className="img-upload-replace"
            onClick={e => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
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
