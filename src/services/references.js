// Past-example references library.
//
// One flat list under localStorage key 'references'. Each entry:
//   {
//     id, slideId,
//     kind: 'deck' | 'manual',
//     label,                // user-facing title for the card
//     source,               // free-text "where it came from" (e.g. deck name, project)
//     savedAt,              // epoch ms
//     blocks?: [...]        // for kind: 'deck' — snapshot of blocks_<slideId>
//     text?: string         // for kind: 'manual' — pasted body
//   }

import { sections } from '../data/sections.js';
import { getCustomSlides } from './customSlides.js';

const KEY = 'references';

function read() {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write(list) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
    window.dispatchEvent(new Event('references-change'));
  } catch {
    // ignore quota errors
  }
}

function newId() {
  return 'ref_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function getReferences() {
  return read();
}

export function getReferencesForSlide(slideId) {
  return read()
    .filter(r => r.slideId === slideId)
    .sort((a, b) => b.savedAt - a.savedAt);
}

export function addManualReference({ slideId, label, source, text }) {
  if (!slideId || !text || !text.trim()) return null;
  const entry = {
    id: newId(),
    slideId,
    kind: 'manual',
    label: (label || '').trim() || 'Untitled reference',
    source: (source || '').trim(),
    savedAt: Date.now(),
    text: text,
  };
  const list = read();
  list.push(entry);
  write(list);
  return entry.id;
}

export function removeReference(id) {
  write(read().filter(r => r.id !== id));
}

export function renameReference(id, label) {
  const list = read();
  const i = list.findIndex(r => r.id === id);
  if (i < 0) return;
  list[i] = { ...list[i], label: (label || '').trim() || list[i].label };
  write(list);
}

// Snapshot the current deck: for every slide that has any blocks, push one
// 'deck' reference entry. Returns the number of slide-references saved.
export function saveDeckAsReferences(deckLabel) {
  const label = (deckLabel || '').trim() || `Deck saved ${new Date().toLocaleDateString()}`;
  const allSlideIds = [
    ...sections.flatMap(s => s.slides.map(sl => sl.id)),
    ...getCustomSlides().map(s => s.id),
  ];

  const list = read();
  const now = Date.now();
  let count = 0;

  for (const slideId of allSlideIds) {
    let blocks;
    try {
      const raw = window.localStorage.getItem('blocks_' + slideId);
      blocks = raw ? JSON.parse(raw) : [];
    } catch {
      blocks = [];
    }
    if (!blocks.length) continue;
    list.push({
      id: newId(),
      slideId,
      kind: 'deck',
      label,
      source: label,
      savedAt: now,
      blocks,
    });
    count++;
  }

  write(list);
  return count;
}

// Bulk add a batch of manual entries from the library page.
// Each entry: { slideId, label, source, text }
export function bulkAddManualReferences(entries) {
  if (!Array.isArray(entries) || !entries.length) return 0;
  const list = read();
  const now = Date.now();
  let added = 0;
  for (const e of entries) {
    if (!e.slideId || !e.text || !e.text.trim()) continue;
    list.push({
      id: newId(),
      slideId: e.slideId,
      kind: 'manual',
      label: (e.label || '').trim() || 'Untitled reference',
      source: (e.source || '').trim(),
      savedAt: now + added, // tiny offset preserves order within the batch
      text: e.text,
    });
    added++;
  }
  write(list);
  return added;
}
