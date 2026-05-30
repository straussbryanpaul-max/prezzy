import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';

function relativeTime(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return new Date(ts).toLocaleDateString();
}

export default function Comments({ comments, onAdd, onRemove }) {
  const [author, setAuthor] = useLocalStorage('commenter_name', '');
  const [text, setText] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!author.trim() || !text.trim()) return;
    onAdd(author, text);
    setText('');
  }

  return (
    <div className="comments-panel">
      {comments.length > 0 && (
        <div className="comments-list">
          {comments.map(c => (
            <div key={c.id} className="comment-item">
              <div className="comment-meta">
                <span className="comment-author">{c.author}</span>
                <span className="comment-time">{relativeTime(c.timestamp)}</span>
                <button
                  className="comment-del"
                  onClick={() => onRemove(c.id)}
                  title="Delete comment"
                >✕</button>
              </div>
              <div className="comment-body">{c.text}</div>
            </div>
          ))}
        </div>
      )}
      <form className="comment-form" onSubmit={handleSubmit}>
        <input
          className="comment-name-input"
          placeholder="Your name"
          value={author}
          onChange={e => setAuthor(e.target.value)}
        />
        <div className="comment-input-row">
          <textarea
            className="comment-textarea"
            placeholder="Add a comment…"
            value={text}
            onChange={e => setText(e.target.value)}
            rows={2}
          />
          <button
            type="submit"
            className="comment-submit"
            disabled={!author.trim() || !text.trim()}
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
}
