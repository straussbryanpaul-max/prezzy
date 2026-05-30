import { useEffect, useRef, useState } from 'react';
import { lsGet } from '../hooks/useLocalStorage.js';
import { getSections, addSlide, deleteSlideFromList, reorderSlide, reorderSection, deleteSection, addSection } from '../services/slideList.js';

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
  const [addingTo, setAddingTo] = useState(null);
  const [addDraft, setAddDraft] = useState('');
  const [addingSection, setAddingSection] = useState(false);
  const [sectionDraft, setSectionDraft] = useState('');
  const [, forceRerender] = useState(0);
  const addInputRef = useRef(null);
  const sectionInputRef = useRef(null);

  // Slide drag state
  const [dragId, setDragId] = useState(null);
  const [dropInfo, setDropInfo] = useState(null); // { sectionId, slideId, position }
  const [dropEmptySec, setDropEmptySec] = useState(null);
  const [slideHandleId, setSlideHandleId] = useState(null); // which slide's handle is hovered

  // Section drag state
  const [dragSecId, setDragSecId] = useState(null);
  const [dropSecInfo, setDropSecInfo] = useState(null); // { sectionId, position }

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

  useEffect(() => {
    if (addingSection && sectionInputRef.current) sectionInputRef.current.focus();
  }, [addingSection]);

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

  function onDeleteSection(sec, e) {
    e.stopPropagation();
    const slideCount = sec.slides.length;
    const label = slideCount > 0
      ? `Delete section "${sec.title}" and its ${slideCount} slide${slideCount !== 1 ? 's' : ''}?`
      : `Delete section "${sec.title}"?`;
    if (!confirm(label)) return;
    deleteSection(sec.id);
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

  // ── Drag handlers ──────────────────────────────────────────────
  // ── Slide drag ──────────────────────────────────────────────────
  function onDragStart(e, slideId) {
    e.stopPropagation();
    setDragId(slideId);
    setSlideHandleId(null);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', slideId);
  }

  function onDragEnd() {
    setDragId(null);
    setDropInfo(null);
    setDropEmptySec(null);
  }

  function onDragOver(e, sectionId, slideId) {
    e.stopPropagation(); // never let section-group see slide drag events
    e.preventDefault();
    if (dragId === slideId) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const position = e.clientY < rect.top + rect.height / 2 ? 'before' : 'after';
    if (dropInfo?.sectionId !== sectionId || dropInfo?.slideId !== slideId || dropInfo?.position !== position) {
      setDropInfo({ sectionId, slideId, position });
    }
  }

  function onDrop(e, sectionId, slideId) {
    e.stopPropagation();
    e.preventDefault();
    if (!dragId || dragId === slideId) { onDragEnd(); return; }
    const sec = sections.find(s => s.id === sectionId);
    if (!sec) { onDragEnd(); return; }
    let targetIdx = sec.slides.findIndex(s => s.id === slideId);
    if (targetIdx < 0) { onDragEnd(); return; }
    if (dropInfo?.position === 'after') targetIdx += 1;
    reorderSlide(dragId, sectionId, targetIdx);
    onDragEnd();
  }

  // ── Section drag ─────────────────────────────────────────────────
  function onSecDragStart(e, sectionId) {
    e.stopPropagation();
    setDragSecId(sectionId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', sectionId);
  }

  function onSecDragEnd() {
    setDragSecId(null);
    setDropSecInfo(null);
  }

  function onSecDragOver(e, sectionId) {
    if (dragId) return; // slide drag in progress — ignore
    e.preventDefault();
    e.stopPropagation();
    if (dragSecId === sectionId) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const position = e.clientY < rect.top + rect.height / 2 ? 'before' : 'after';
    if (dropSecInfo?.sectionId !== sectionId || dropSecInfo?.position !== position) {
      setDropSecInfo({ sectionId, position });
    }
  }

  function onSecDrop(e, sectionId) {
    if (dragId) return;
    e.preventDefault();
    e.stopPropagation();
    if (!dragSecId || dragSecId === sectionId) { onSecDragEnd(); return; }
    let targetIdx = sections.findIndex(s => s.id === sectionId);
    if (targetIdx < 0) { onSecDragEnd(); return; }
    if (dropSecInfo?.position === 'after') targetIdx += 1;
    reorderSection(dragSecId, targetIdx);
    onSecDragEnd();
  }

  return (
    <div className={`sidebar${open ? '' : ' hidden'}`}>
      <button className="sidebar-close" onClick={onClose} title="Hide sidebar">◀</button>

      {sections.map(sec => {
        const isCollapsed = !!collapsed[sec.id];
        const secDropPos = dropSecInfo?.sectionId === sec.id ? dropSecInfo.position : null;
        const secCls = [
          'section-group',
          dragSecId === sec.id ? 'sg-dragging' : '',
          secDropPos === 'before' ? 'sg-drop-before' : '',
          secDropPos === 'after'  ? 'sg-drop-after'  : '',
        ].filter(Boolean).join(' ');
        return (
          <div
            key={sec.id}
            className={secCls}
            onDragOver={e => onSecDragOver(e, sec.id)}
            onDrop={e => onSecDrop(e, sec.id)}
          >
            <div
              className={`section-header${isCollapsed ? ' collapsed' : ''}`}
              onClick={() => !dragSecId && toggleSection(sec.id)}
            >
              <span
                className="section-drag-handle"
                title="Drag to reorder section"
                draggable
                onDragStart={e => onSecDragStart(e, sec.id)}
                onDragEnd={onSecDragEnd}
              >⠿</span>
              <span className="section-header-title">{sec.title}</span>
              <div className="section-header-actions">
                <button
                  className="section-add-btn"
                  title="Add slide to this section"
                  onClick={e => openAddForm(sec.id, e)}
                >+</button>
                <button
                  className="section-del-btn"
                  title="Delete this section"
                  onClick={e => onDeleteSection(sec, e)}
                >×</button>
                <span className="arrow">▼</span>
              </div>
            </div>

            {!isCollapsed && (
              <div className="section-items">
                {sec.slides.map(sl => {
                  const redacted = sl.redacted || isSlideRedacted(sl.id);
                  const preread = isSlidePreRead(sl);
                  const isDragging = dragId === sl.id;
                  const dropPos = dropInfo?.sectionId === sec.id && dropInfo?.slideId === sl.id
                    ? dropInfo.position : null;
                  const cls = [
                    'slide-item',
                    sl.id === activeSlideId ? 'active' : '',
                    redacted && !showRedacted ? 'redacted-item' : '',
                    isDragging ? 'si-dragging' : '',
                    dropPos === 'before' ? 'si-drop-before' : '',
                    dropPos === 'after' ? 'si-drop-after' : '',
                  ].filter(Boolean).join(' ');

                  return (
                    <div
                      key={sl.id}
                      className={cls}
                      draggable={slideHandleId === sl.id}
                      data-redact-version={redactVersion}
                      data-preread-version={preReadVersion}
                      onClick={() => !isDragging && onNavigate(sl.id)}
                      title={`${sl.num} — ${sl.title}`}
                      onDragStart={e => onDragStart(e, sl.id)}
                      onDragEnd={onDragEnd}
                      onDragOver={e => onDragOver(e, sec.id, sl.id)}
                      onDrop={e => onDrop(e, sec.id, sl.id)}
                    >
                      <span
                        className="slide-drag-handle"
                        title="Drag to reorder"
                        onMouseEnter={() => setSlideHandleId(sl.id)}
                        onMouseLeave={() => setSlideHandleId(null)}
                      >⠿</span>
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

                {/* Drop zone shown when section is empty and a slide is being dragged */}
                {sec.slides.length === 0 && dragId && (
                  <div
                    className={`slide-empty-drop${dropEmptySec === sec.id ? ' active' : ''}`}
                    onDragOver={e => { if (dragSecId) return; e.preventDefault(); setDropEmptySec(sec.id); }}
                    onDragLeave={() => setDropEmptySec(null)}
                    onDrop={e => { e.preventDefault(); reorderSlide(dragId, sec.id, 0); onDragEnd(); }}
                  >
                    Drop here
                  </div>
                )}

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

      {/* ── New Section ── */}
      <div className="sidebar-new-section">
        {addingSection ? (
          <div className="slide-add-form">
            <input
              ref={sectionInputRef}
              className="slide-add-input"
              placeholder="Section name…"
              value={sectionDraft}
              onChange={e => setSectionDraft(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  const t = sectionDraft.trim();
                  if (t) { addSection(t); setCollapsed(prev => ({ ...prev })); }
                  setAddingSection(false); setSectionDraft('');
                }
                if (e.key === 'Escape') { setAddingSection(false); setSectionDraft(''); }
              }}
            />
            <div className="slide-add-actions">
              <button
                className="slide-add-ok"
                onClick={() => {
                  const t = sectionDraft.trim();
                  if (t) addSection(t);
                  setAddingSection(false); setSectionDraft('');
                }}
              >Add Section</button>
              <button className="slide-add-cancel" onClick={() => { setAddingSection(false); setSectionDraft(''); }}>✕</button>
            </div>
          </div>
        ) : (
          <button className="sidebar-new-section-btn" onClick={() => setAddingSection(true)}>
            + New Section
          </button>
        )}
      </div>
    </div>
  );
}
