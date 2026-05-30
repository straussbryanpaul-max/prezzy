import { createPortal } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import { lsGet } from '../hooks/useLocalStorage.js';
import { getSections, addSlide, deleteSlideFromList, reorderSlide, moveSlide, reorderSection, deleteSection, addSection } from '../services/slideList.js';

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

  // ── Pointer-based slide drag ────────────────────────────────────
  const [dragSlide, setDragSlide] = useState(null); // { slideId, title, x, y }
  const [dropTarget, setDropTarget] = useState(null); // { sectionId, slideId, position }
  const sectionsRef = useRef(sections);
  sectionsRef.current = sections;
  const dropTargetRef = useRef(null);
  dropTargetRef.current = dropTarget;
  const dragSlideRef = useRef(null);
  dragSlideRef.current = dragSlide;

  // ── Section drag ────────────────────────────────────────────────
  const secDragTypeRef = useRef(null);
  const [dragSecId, setDragSecId] = useState(null);
  const [dropSecInfo, setDropSecInfo] = useState(null);

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

  // Pointer drag: attach document listeners while dragging
  useEffect(() => {
    if (!dragSlide) return;

    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';

    function onMouseMove(e) {
      setDragSlide(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : null);

      // Find which slide item is under the cursor (ghost has pointer-events:none)
      const els = document.elementsFromPoint(e.clientX, e.clientY);
      const slideEl = els.find(el => el.dataset && el.dataset.slideId && el.dataset.slideId !== dragSlideRef.current?.slideId);

      if (slideEl) {
        const rect = slideEl.getBoundingClientRect();
        const position = e.clientY < rect.top + rect.height / 2 ? 'before' : 'after';
        const next = { sectionId: slideEl.dataset.sectionId, slideId: slideEl.dataset.slideId, position };
        setDropTarget(prev =>
          prev?.sectionId === next.sectionId && prev?.slideId === next.slideId && prev?.position === next.position
            ? prev : next
        );
      } else {
        setDropTarget(null);
      }
    }

    function onMouseUp() {
      const target = dropTargetRef.current;
      const ds = dragSlideRef.current;
      if (target && ds) {
        if (target.slideId === '__empty__') {
          reorderSlide(ds.slideId, target.sectionId, 0);
        } else {
          const sec = sectionsRef.current.find(s => s.id === target.sectionId);
          if (sec) {
            let idx = sec.slides.findIndex(s => s.id === target.slideId);
            if (idx >= 0) {
              if (target.position === 'after') idx++;
              reorderSlide(ds.slideId, target.sectionId, idx);
            }
          }
        }
      }
      setDragSlide(null);
      setDropTarget(null);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [!!dragSlide]); // only re-attach when drag starts/stops

  function onHandleMouseDown(e, slideId, title) {
    e.preventDefault();
    e.stopPropagation();
    setDragSlide({ slideId, title, x: e.clientX, y: e.clientY });
  }

  // ── Section drag handlers ────────────────────────────────────────
  function onSecDragStart(e, sectionId) {
    e.stopPropagation();
    secDragTypeRef.current = 'section';
    setDragSecId(sectionId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', sectionId);
  }

  function onSecDragEnd() {
    secDragTypeRef.current = null;
    setDragSecId(null);
    setDropSecInfo(null);
  }

  function onSecDragOver(e, sectionId) {
    if (secDragTypeRef.current !== 'section') return;
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
    if (secDragTypeRef.current !== 'section') return;
    e.preventDefault();
    e.stopPropagation();
    if (!dragSecId || dragSecId === sectionId) { onSecDragEnd(); return; }
    let targetIdx = sections.findIndex(s => s.id === sectionId);
    if (targetIdx < 0) { onSecDragEnd(); return; }
    if (dropSecInfo?.position === 'after') targetIdx += 1;
    reorderSection(dragSecId, targetIdx);
    onSecDragEnd();
  }

  // ── Other handlers ───────────────────────────────────────────────
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
      : `Remove "${sl.title}" from this presentation?\n\n(The slide data is not lost.)`;
    if (!confirm(label)) return;
    deleteSlideFromList(sl.id);
    if (sl.id === activeSlideId) onNavigate('cover');
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

  const allSlides = sections.flatMap(s => s.slides);
  const dragTitle = dragSlide ? (allSlides.find(s => s.id === dragSlide.slideId)?.title || '') : '';

  return (
    <>
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
                  <button className="section-add-btn" title="Add slide" onClick={e => openAddForm(sec.id, e)}>+</button>
                  <button className="section-del-btn" title="Delete section" onClick={e => onDeleteSection(sec, e)}>×</button>
                  <span className="arrow">▼</span>
                </div>
              </div>

              {!isCollapsed && (
                <div className="section-items">
                  {sec.slides.map((sl, slIdx) => {
                    const redacted = sl.redacted || isSlideRedacted(sl.id);
                    const preread = isSlidePreRead(sl);
                    const isDragging = dragSlide?.slideId === sl.id;
                    const dropPos = dropTarget?.slideId === sl.id ? dropTarget.position : null;
                    const cls = [
                      'slide-item',
                      sl.id === activeSlideId ? 'active' : '',
                      redacted && !showRedacted ? 'redacted-item' : '',
                      isDragging ? 'si-dragging' : '',
                      dropPos === 'before' ? 'si-drop-before' : '',
                      dropPos === 'after'  ? 'si-drop-after'  : '',
                    ].filter(Boolean).join(' ');

                    return (
                      <div
                        key={sl.id}
                        className={cls}
                        data-slide-id={sl.id}
                        data-section-id={sec.id}
                        data-redact-version={redactVersion}
                        data-preread-version={preReadVersion}
                        onClick={() => !dragSlide && onNavigate(sl.id)}
                        title={`${sl.num} — ${sl.title}`}
                      >
                        <span
                          className="slide-drag-handle"
                          title="Drag to reorder"
                          onMouseDown={e => onHandleMouseDown(e, sl.id, sl.title)}
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

                  {sec.slides.length === 0 && (
                    <div
                      className={`slide-empty-drop${dropTarget?.sectionId === sec.id && dropTarget?.slideId === '__empty__' ? ' active' : ''}`}
                      data-section-id={sec.id}
                      data-slide-id="__empty__"
                    >Drop here</div>
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
                    <button className="section-add-slide-btn" onClick={e => openAddForm(sec.id, e)}>+ Add slide</button>
                  )}
                </div>
              )}
            </div>
          );
        })}

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
                  if (e.key === 'Enter') { const t = sectionDraft.trim(); if (t) addSection(t); setAddingSection(false); setSectionDraft(''); }
                  if (e.key === 'Escape') { setAddingSection(false); setSectionDraft(''); }
                }}
              />
              <div className="slide-add-actions">
                <button className="slide-add-ok" onClick={() => { const t = sectionDraft.trim(); if (t) addSection(t); setAddingSection(false); setSectionDraft(''); }}>Add Section</button>
                <button className="slide-add-cancel" onClick={() => { setAddingSection(false); setSectionDraft(''); }}>✕</button>
              </div>
            </div>
          ) : (
            <button className="sidebar-new-section-btn" onClick={() => setAddingSection(true)}>+ New Section</button>
          )}
        </div>
      </div>

      {/* Drag ghost — pointer-events:none so it doesn't block hit testing */}
      {dragSlide && createPortal(
        <div
          className="slide-drag-ghost"
          style={{ top: dragSlide.y + 8, left: dragSlide.x + 12 }}
        >
          {dragTitle}
        </div>,
        document.body
      )}
    </>
  );
}
