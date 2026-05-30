// Authoritative slide list — layers on top of sections.js defaults.
// Persisted to localStorage so the user can add/remove/reorder slides without
// touching code. All custom slides created here are also registered in the
// customSlides registry so SlideRouter and CustomSlide.jsx can find them.

import { sections as builtIn } from '../data/sections.js';
import { createCustomSlide, getCustomSlides, deleteCustomSlide } from './customSlides.js';

const KEY = 'slide_list';

function numConfig(sectionTitle) {
  const m = sectionTitle.match(/^(\d{2})\.(\d{3})/);
  return m ? { prefix: m[1], base: parseInt(m[2], 10) } : null;
}

// Reassign section title prefixes based on position among numeric sections,
// then derive slide nums from each section's new prefix.
function computeNums(secs) {
  // Step 1: renumber section titles sequentially (00.000, 01.000, 02.000 …)
  let majorIdx = 0;
  const retitled = secs.map(sec => {
    if (!numConfig(sec.title)) return sec; // non-numeric section unchanged
    const prefix = String(majorIdx).padStart(2, '0');
    majorIdx++;
    const newTitle = sec.title.replace(/^\d{2}\.\d{3}/, `${prefix}.000`);
    return { ...sec, title: newTitle };
  });

  // Step 2: compute slide nums from each section's (now updated) prefix
  return retitled.map(sec => {
    const cfg = numConfig(sec.title);
    return {
      ...sec,
      slides: sec.slides.map((sl, i) => {
        if (sl.fixedNum) return { ...sl, num: sl.fixedNum };
        if (cfg) return { ...sl, num: `${cfg.prefix}.${String(i + 1).padStart(3, '0')}` };
        return { ...sl, num: String(i + 1) };
      }),
    };
  });
}

function buildDefault() {
  const secs = builtIn.map(sec => ({
    id: sec.id,
    title: sec.title,
    slides: sec.slides.map(sl => ({
      id: sl.id,
      title: sl.title,
      num: sl.num,
      isCustom: false,
      preread: !!sl.preread,
      redacted: !!sl.redacted,
    })),
  }));

  const custom = getCustomSlides();
  if (custom.length) {
    secs.push({
      id: 's_custom',
      title: '✨ Custom Slides',
      slides: custom.map(sl => ({
        id: sl.id,
        title: sl.title,
        num: sl.num,
        isCustom: true,
        preread: false,
        redacted: false,
      })),
    });
  }

  return computeNums(secs);
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? computeNums(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

function persist(secs) {
  localStorage.setItem(KEY, JSON.stringify(secs));
  window.dispatchEvent(new Event('slide-list-change'));
}

export function getSections() {
  return load() || buildDefault();
}

export function getAllSlides() {
  return getSections().flatMap(s => s.slides);
}

export function addSlide(sectionId, title) {
  const secs = load() || buildDefault();

  let sec = secs.find(s => s.id === sectionId);
  if (!sec) {
    if (sectionId === 's_custom') {
      sec = { id: 's_custom', title: '✨ Custom Slides', slides: [] };
      secs.push(sec);
    } else {
      return null;
    }
  }

  const slideId = createCustomSlide(title || 'New Slide');

  sec.slides.push({
    id: slideId,
    title: title || 'New Slide',
    num: '',
    isCustom: true,
    preread: false,
    redacted: false,
  });

  persist(computeNums(secs));
  return slideId;
}

export function deleteSlideFromList(slideId) {
  const secs = load() || buildDefault();
  let wasCustom = false;

  for (const sec of secs) {
    const idx = sec.slides.findIndex(s => s.id === slideId);
    if (idx >= 0) {
      wasCustom = sec.slides[idx].isCustom;
      sec.slides.splice(idx, 1);
      break;
    }
  }

  if (wasCustom) deleteCustomSlide(slideId);
  persist(computeNums(secs));
}

export function moveSlide(slideId, direction) {
  const secs = load() || buildDefault();
  let fromSecIdx = -1, fromSlideIdx = -1;
  for (let si = 0; si < secs.length; si++) {
    const idx = secs[si].slides.findIndex(s => s.id === slideId);
    if (idx >= 0) { fromSecIdx = si; fromSlideIdx = idx; break; }
  }
  if (fromSecIdx < 0) return;

  const [moved] = secs[fromSecIdx].slides.splice(fromSlideIdx, 1);

  if (direction === 'up') {
    if (fromSlideIdx > 0) {
      secs[fromSecIdx].slides.splice(fromSlideIdx - 1, 0, moved);
    } else if (fromSecIdx > 0) {
      secs[fromSecIdx - 1].slides.push(moved);
    } else {
      secs[fromSecIdx].slides.unshift(moved);
    }
  } else {
    if (fromSlideIdx < secs[fromSecIdx].slides.length) {
      secs[fromSecIdx].slides.splice(fromSlideIdx + 1, 0, moved);
    } else if (fromSecIdx < secs.length - 1) {
      secs[fromSecIdx + 1].slides.unshift(moved);
    } else {
      secs[fromSecIdx].slides.push(moved);
    }
  }

  persist(computeNums(secs));
}

export function reorderSlide(slideId, targetSectionId, targetIdx) {
  const secs = load() || buildDefault();

  let moved = null;
  for (const sec of secs) {
    const idx = sec.slides.findIndex(s => s.id === slideId);
    if (idx >= 0) { [moved] = sec.slides.splice(idx, 1); break; }
  }
  if (!moved) return;

  const targetSec = secs.find(s => s.id === targetSectionId);
  if (!targetSec) return;
  targetSec.slides.splice(targetIdx, 0, moved);

  persist(computeNums(secs));
}

export function deleteSection(sectionId) {
  const secs = load() || buildDefault();
  const sec = secs.find(s => s.id === sectionId);
  if (!sec) return;
  for (const sl of sec.slides) {
    if (sl.isCustom) deleteCustomSlide(sl.id);
  }
  persist(computeNums(secs.filter(s => s.id !== sectionId)));
}

export function reorderSection(sectionId, targetIdx) {
  const secs = load() || buildDefault();
  const fromIdx = secs.findIndex(s => s.id === sectionId);
  if (fromIdx < 0) return;
  const [moved] = secs.splice(fromIdx, 1);
  secs.splice(targetIdx, 0, moved);
  persist(computeNums(secs));
}

export function addSection(title) {
  const secs = load() || buildDefault();
  const id = 's_user_' + Date.now().toString(36);
  secs.push({ id, title: title.trim(), slides: [] });
  persist(computeNums(secs));
  return id;
}

export function updateSlideTitleInList(slideId, newTitle) {
  const secs = load() || buildDefault();
  for (const sec of secs) {
    const sl = sec.slides.find(s => s.id === slideId);
    if (sl) { sl.title = newTitle; break; }
  }
  persist(secs);
}
