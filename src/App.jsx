import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ fontFamily: 'system-ui', padding: 32, maxWidth: 720, margin: '0 auto' }}>
      <h1>Estimate Basis Builder</h1>
      <p style={{ color: '#64748B' }}>
        React skeleton is running. Real app coming next.
      </p>
      <button
        onClick={() => setCount(c => c + 1)}
        style={{
          padding: '8px 16px',
          background: '#0078D4',
          color: 'white',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer',
        }}
      >
        Click me: {count}
      </button>
    </div>
  );
}
