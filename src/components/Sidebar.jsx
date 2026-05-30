import { useEffect, useRef, useState } from 'react';
import { lsGet } from '../hooks/useLocalStorage.js';
import { getSections, addSlide, deleteSlideFromList } from '../services/slideList.js';

function isSlideRedacted(id) {
  return lsGet('redact_' + id, '') === 'true';
}

function isSlidePreRead(sl) {
  const stored = lsGet('preread_' + sl.id, '');
  if (stored === '') return !!sl.preread;
  return stored === 'true';
}

export default function Sidebar({
  activeSlideId,
  showRedacted,
  onNavigate,
  redactVersion,
  preReadVersion,
  open = true,
  onClose,
}) {
  const [sections, setSections] = useState(() => getSections());
  const [collapsed, setCollapsed] = useState({});
  const [addingTo, setAddingTo] = useState(null); // sectionId currently adding to
  const [addDraft, setAddDraft] = useState('');
  const [, forceRerender] = useState(0);
  const addInputRef = useRef(null);

  function refresh() {
    setSections(getSections());
    forceRerender(v => v + 1);
  }

  useEffect(() => {
    window.addEventListener('slide-list-change', refresh);
    window.addEventListener('preread-change', refresh);
    window.addEventListener('assignment-change', refresh);
    return () => {
      window.removeEventListener('slide-list-change', refresh);
      window.removeEventListener('preread-change', refresh);
      window.removeEventListener('assignment-change', refresh);
    };
  }, []);

  useEffect(() => {
    if (addingTo && addInputRef.current) addInputRef.current.focus();
  }, [addingTo]);

  function toggleSection(id) {
    setCollapsed(prev => ({ ...prev, [id]: !prev[id] }));
  }

  function openAddForm(sectionId, e) {
    e.stopPropagation();
    setAddDraft('');
    setAddingTo(sectionId);
  }

  function confirmAdd(sectionId) {
    const title = addDraft.trim();
    if (!title) { setAddingTo(null); return; }
    const newId = addSlide(sectionId, title);
    setAddingTo(null);
    if (newId) onNavigate(newId);
  }

  function onAddKeyDown(e, sectionId) {
    if (e.key === 'Enter') confirmAdd(sectionId);
    if (e.key === 'Escape') setAddingTo(null);
  }

  function onDeleteSlide(sl, e) {
    e.stopPropagation();
    const label = sl.isCustom
      ? `Delete "${sl.title}"? This also removes its blocks.`
      : `Remove "${sl.title}" from this presentation?\n\n(The slide data is not lost — it can be restored by resetting the slide list.)`;
    if (!confirm(label)) return;
    deleteSlideFromList(sl.id);
    if (sl.id === activeSlideId) onNavigate('cover');
  }

  return (
    <div className={`sidebar${open ? '' : ' hidden'}`}>
      <button className="sidebar-close" onClick={onClose} title="Hide sidebar">◀</button>

      {sections.map(sec => {
        const isCollapsed = !!collapsed[sec.id];
        return (
          <div key={sec.id} className="section-group">
            <div
              className={`section-header${isCollapsed ? ' collapsed' : ''}`}
              onClick={() => toggleSection(sec.id)}
            >
              <span className="section-header-title">{sec.title}</span>
              <div className="section-header-actions">
                <button
                  className="section-add-btn"
                  title="Add slide to this section"
                  onClick={e => openAddForm(sec.id, e)}
                >+</button>
                <span className="arrow">▼</span>
              </div>
            </div>

            {!isCollapsed && (
              <div className="section-items">
                {sec.slides.map(sl => {
                  const redacted = sl.redacted || isSlideRedacted(sl.id);
                  const preread = isSlidePreRead(sl);
                  const cls =
                    (sl.id === activeSlideId ? 'active ' : '') +
                    (redacted && !showRedacted ? 'redacted-item ' : '');
                  return (
                    <div
                      key={sl.id}
                      className={`slide-item ${cls}`}
                      data-redact-version={redactVersion}
                      data-preread-version={preReadVersion}
                      onClick={() => onNavigate(sl.id)}
                      title={`${sl.num} — ${sl.title}`}
                    >
                      <span className="slide-item-num">{sl.num}</span>
                      <span className="slide-item-title">{sl.title}</span>
                      <div className="slide-item-badges">
                        {preread && <span className="badge chip chip-preread" title="Pre-Read Only">PRE</span>}
                        {redacted && <span className="badge" title="Redacted">🔒</span>}
                      </div>
                      <button
                        className="slide-item-del"
                        title="Remove this slide"
                        onClick={e => onDeleteSlide(sl, e)}
                      >×</button>
                    </div>
                  );
                })}

                {/* Inline add form */}
                {addingTo === sec.id ? (
                  <div className="slide-add-form">
                    <input
                      ref={addInputRef}
                      className="slide-add-input"
                      placeholder="Slide title…"
                      value={addDraft}
                      onChange={e => setAddDraft(e.target.value)}
                      onKeyDown={e => onAddKeyDown(e, sec.id)}
                    />
                    <div className="slide-add-actions">
                      <button className="slide-add-ok" onClick={() => confirmAdd(sec.id)}>Add</button>
                      <button className="slide-add-cancel" onClick={() => setAddingTo(null)}>✕</button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="section-add-slide-btn"
                    onClick={e => openAddForm(sec.id, e)}
                  >+ Add slide</button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
