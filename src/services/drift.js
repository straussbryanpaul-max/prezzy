// Drift = differences between the currently-loaded template's baseline state
// and the user's current state. Focuses on the things that matter most for
// review: which sections/chunks have been removed and which custom slides
// have been added or removed since the template was loaded.

import { allSlides, sections } from '../data/sections.js';
import { getCustomSlides } from './customSlides.js';
import { listTemplates, getCurrentTemplateName } from './templates.js';

function readPrefixedTrueKeys(prefix) {
  const out = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i);
    if (k?.startsWith(prefix) && window.localStorage.getItem(k) === 'true') {
      out.push(k.slice(prefix.length));
    }
  }
  return out;
}

function templatePrefixedTrueKeys(data, prefix) {
  if (!data) return [];
  return Object.keys(data)
    .filter(k => k.startsWith(prefix) && data[k] === 'true')
    .map(k => k.slice(prefix.length));
}

function slideTitleFor(id) {
  const sl = allSlides.find(s => s.id === id);
  if (sl) return `${sl.num} — ${sl.title}`;
  // Custom slide?
  const custom = getCustomSlides().find(s => s.id === id);
  if (custom) return `${custom.num} — ${custom.title}`;
  return id;
}

function sectionForSlide(id) {
  for (const sec of sections) {
    if (sec.slides.some(s => s.id === id)) return sec.title;
  }
  return 'Custom';
}

// Make chunk ids like "proj_data:milestones" readable.
function prettyChunkId(chunkId) {
  const [slideId, chunkLabel] = chunkId.split(':');
  const slide = allSlides.find(s => s.id === slideId);
  const slideTitle = slide ? slide.title : slideId;
  const niceChunk = (chunkLabel || '').replace(/_/g, ' ');
  return `${slideTitle} → ${niceChunk}`;
}

export function computeDrift() {
  const templateName = getCurrentTemplateName();
  const tpl = templateName ? listTemplates()[templateName] : null;

  const currentSecDels = readPrefixedTrueKeys('sec_del_');
  const currentChunkDels = readPrefixedTrueKeys('chunk_del_');
  const currentCustom = getCustomSlides();
  const currentCustomIds = new Set(currentCustom.map(s => s.id));

  let baselineSecDels = new Set();
  let baselineChunkDels = new Set();
  let baselineCustomIds = new Set();
  let baselineCustomById = new Map();

  if (tpl?.data) {
    baselineSecDels = new Set(templatePrefixedTrueKeys(tpl.data, 'sec_del_'));
    baselineChunkDels = new Set(templatePrefixedTrueKeys(tpl.data, 'chunk_del_'));
    try {
      const baseCustom = JSON.parse(tpl.data['custom_slides'] || '[]');
      for (const s of baseCustom) {
        baselineCustomIds.add(s.id);
        baselineCustomById.set(s.id, s);
      }
    } catch {
      // ignore
    }
  }

  // Deletions added since baseline
  const addedSecDels = currentSecDels
    .filter(id => !baselineSecDels.has(id))
    .map(id => ({
      id,
      label: slideTitleFor(id),
      section: sectionForSlide(id),
    }));

  const addedChunkDels = currentChunkDels
    .filter(id => !baselineChunkDels.has(id))
    .map(id => ({
      id,
      label: prettyChunkId(id),
    }));

  // Custom slides added since baseline
  const addedCustom = currentCustom
    .filter(s => !baselineCustomIds.has(s.id))
    .map(s => ({ id: s.id, label: `${s.num} — ${s.title}` }));

  // Custom slides that WERE in the template but are gone now
  const removedCustom = [];
  for (const [id, s] of baselineCustomById) {
    if (!currentCustomIds.has(id)) {
      removedCustom.push({ id, label: `${s.num} — ${s.title}` });
    }
  }

  // Section deletions that were in template but now restored (less critical
  // to surface, but useful to note)
  const restoredSecDels = [...baselineSecDels]
    .filter(id => !currentSecDels.includes(id))
    .map(id => ({ id, label: slideTitleFor(id) }));

  const totalChanges =
    addedSecDels.length +
    addedChunkDels.length +
    addedCustom.length +
    removedCustom.length;

  return {
    templateName,
    hasTemplate: !!tpl,
    addedSecDels,
    addedChunkDels,
    addedCustom,
    removedCustom,
    restoredSecDels,
    totalChanges,
  };
}
