// User-created custom slides (created via "Break out to new slide" on a block).
// Stored in localStorage; replace with backend when wired to Databricks.

const KEY = 'custom_slides';

export function getCustomSlides() {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeCustomSlides(list) {
  window.localStorage.setItem(KEY, JSON.stringify(list));
}

function nextCustomNum() {
  const list = getCustomSlides();
  return `C-${list.length + 1}`;
}

export function createCustomSlide(title) {
  const trimmed = (title || '').trim() || 'Custom Slide';
  const id = 'custom_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const list = getCustomSlides();
  list.push({
    id,
    title: trimmed,
    num: nextCustomNum(),
    created: Date.now(),
  });
  writeCustomSlides(list);
  window.dispatchEvent(new Event('custom-slides-change'));
  window.dispatchEvent(new Event('drift-state-change'));
  return id;
}

export function findCustomSlide(slideId) {
  return getCustomSlides().find(s => s.id === slideId) || null;
}

export function renameCustomSlide(slideId, newTitle) {
  const trimmed = (newTitle || '').trim();
  if (!trimmed) return;
  const list = getCustomSlides();
  const i = list.findIndex(s => s.id === slideId);
  if (i < 0) return;
  list[i] = { ...list[i], title: trimmed };
  writeCustomSlides(list);
  window.dispatchEvent(new Event('custom-slides-change'));
  window.dispatchEvent(new Event('drift-state-change'));
}

export function deleteCustomSlide(slideId) {
  const list = getCustomSlides().filter(s => s.id !== slideId);
  writeCustomSlides(list);
  // Clean up the slide's blocks + per-slide state
  const prefixes = [
    'blocks_',
    'bd_',
    'assignee_',
    'complete_',
    'preread_',
    'redact_',
    'sec_del_',
    'sec_size_',
  ];
  for (const p of prefixes) {
    window.localStorage.removeItem(p + slideId);
  }
  window.dispatchEvent(new Event('custom-slides-change'));
  window.dispatchEvent(new Event('drift-state-change'));
}
