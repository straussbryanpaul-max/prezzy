import { useRef } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';

export default function ImageUpload({ name }) {
  const [src, setSrc] = useLocalStorage('img_' + name, '');
  const inputRef = useRef(null);

  function onChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setSrc(ev.target.result);
    reader.readAsDataURL(file);
  }

  return (
    <div className="img-upload" onClick={() => inputRef.current?.click()}>
      <input ref={inputRef} type="file" accept="image/*" onChange={onChange} />
      <div className="icon">📸</div>
      <p>Click to upload screenshot / image</p>
      {src && <img src={src} alt="uploaded" />}
    </div>
  );
}
