// Template system: capture/save/load the user's customized state.
//
// A template snapshots every localStorage key EXCEPT the transient UI prefs
// listed below. That means a template can include:
//   - structural state: deletions, sizes, modular blocks, pre-read/redact
//   - content: form field values, brain dumps, uploaded images
//   - estimator notes
//
// The user picks "Save current as template" once they've built something
// they want to reuse. Loading replaces the current state.

const TEMPLATES_KEY = 'boe_templates';
const CURRENT_TEMPLATE_KEY = 'current_template';

// Keys preserved across template loads — UI-only state, not project content.
const PRESERVE_KEYS = new Set([
  'apiKey',
  'showRedacted',
  'sidebarOpen',
  'ai_extract_instr',
  'commenter_name',
  CURRENT_TEMPLATE_KEY,
]);

export function getCurrentTemplateName() {
  return window.localStorage.getItem(CURRENT_TEMPLATE_KEY) || '';
}

function setCurrentTemplateName(name) {
  if (name) {
    window.localStorage.setItem(CURRENT_TEMPLATE_KEY, name);
  } else {
    window.localStorage.removeItem(CURRENT_TEMPLATE_KEY);
  }
  window.dispatchEvent(new Event('current-template-change'));
}

function shouldCapture(key) {
  if (!key) return false;
  if (PRESERVE_KEYS.has(key)) return false;
  if (key === TEMPLATES_KEY) return false;
  if (key.startsWith('comments_')) return false;
  return true;
}

function getAllCapturableKeys() {
  const keys = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i);
    if (shouldCapture(k)) keys.push(k);
  }
  return keys;
}

export function captureCurrentState() {
  const out = {};
  for (const k of getAllCapturableKeys()) {
    out[k] = window.localStorage.getItem(k);
  }
  return out;
}

export function listTemplates() {
  try {
    return JSON.parse(window.localStorage.getItem(TEMPLATES_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeTemplates(map) {
  window.localStorage.setItem(TEMPLATES_KEY, JSON.stringify(map));
}

export function saveTemplate(name) {
  const trimmed = (name || '').trim();
  if (!trimmed) throw new Error('Template name required');
  const all = listTemplates();
  if (all[trimmed]?.locked) {
    throw new Error(`Template "${trimmed}" is locked. Unlock it first to overwrite.`);
  }
  all[trimmed] = {
    created: all[trimmed]?.created || Date.now(),
    updated: Date.now(),
    locked: all[trimmed]?.locked || false,
    data: captureCurrentState(),
  };
  writeTemplates(all);
  // Treat the most recently-saved template as the "current" one
  setCurrentTemplateName(trimmed);
  return all[trimmed];
}

export function loadTemplate(name) {
  const all = listTemplates();
  const t = all[name];
  if (!t) throw new Error('Template not found: ' + name);

  // Clear capturable keys
  for (const k of getAllCapturableKeys()) {
    window.localStorage.removeItem(k);
  }
  // Apply template
  Object.entries(t.data).forEach(([k, v]) => {
    if (v != null) window.localStorage.setItem(k, v);
  });
  setCurrentTemplateName(name);
}

export function deleteTemplate(name) {
  const all = listTemplates();
  if (all[name]?.locked) {
    throw new Error(`Template "${name}" is locked. Unlock it first to delete.`);
  }
  delete all[name];
  writeTemplates(all);
  if (getCurrentTemplateName() === name) {
    setCurrentTemplateName('');
  }
}

export function renameTemplate(oldName, newName) {
  const trimmed = (newName || '').trim();
  if (!trimmed) throw new Error('New name required');
  const all = listTemplates();
  if (!all[oldName]) throw new Error('Template not found');
  if (all[oldName].locked) {
    throw new Error(`Template "${oldName}" is locked. Unlock it first to rename.`);
  }
  if (all[trimmed] && trimmed !== oldName) {
    throw new Error('A template named "' + trimmed + '" already exists');
  }
  all[trimmed] = { ...all[oldName], updated: Date.now() };
  if (trimmed !== oldName) delete all[oldName];
  writeTemplates(all);
  if (getCurrentTemplateName() === oldName) {
    setCurrentTemplateName(trimmed);
  }
}

export function setTemplateLocked(name, locked) {
  const all = listTemplates();
  if (!all[name]) throw new Error('Template not found');
  all[name] = { ...all[name], locked: !!locked, updated: Date.now() };
  writeTemplates(all);
}

export function resetToBlank() {
  for (const k of getAllCapturableKeys()) {
    window.localStorage.removeItem(k);
  }
  setCurrentTemplateName('');
}

export function isDeletedInBaseline(slideId) {
  const name = getCurrentTemplateName();
  if (!name) return false;
  const tpl = listTemplates()[name];
  return tpl?.data?.['sec_del_' + slideId] === 'true';
}

// Rough size in KB, useful for the UI.
export function templateSizeKB(template) {
  try {
    return Math.round(JSON.stringify(template.data).length / 1024);
  } catch {
    return 0;
  }
}
