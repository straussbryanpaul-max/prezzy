// Per-slide assignment + completion tracking, all in localStorage for now.
// The Databricks backend will replace this with a real db + auth.

import { allSlides } from '../data/sections.js';

const KNOWN_KEY = 'known_assignees';

export function getKnownAssignees() {
  try {
    return JSON.parse(window.localStorage.getItem(KNOWN_KEY) || '[]');
  } catch {
    return [];
  }
}

export function addKnownAssignee(name) {
  const trimmed = (name || '').trim();
  if (!trimmed) return;
  const list = getKnownAssignees();
  if (!list.includes(trimmed)) {
    list.push(trimmed);
    list.sort((a, b) => a.localeCompare(b));
    window.localStorage.setItem(KNOWN_KEY, JSON.stringify(list));
  }
}

// Auto-detect status from localStorage signals.
// Returns 'untouched' | 'in_progress' | 'complete'
export function slideStatus(slideId, manualComplete) {
  if (manualComplete) return 'complete';
  if (slideHasAnyContent(slideId)) return 'in_progress';
  return 'untouched';
}

// Detect whether a slide has ANY user-entered content.
// Looks across all slide-prefixed localStorage keys (form fields, brain dumps,
// images, blocks) — heuristic but reasonable.
function slideHasAnyContent(slideId) {
  // Brain dump
  if (window.localStorage.getItem('bd_' + slideId)) return true;
  // Any image associated with this slide id (img_<something containing slideId>)
  // Any block list
  if (window.localStorage.getItem('blocks_' + slideId)) {
    try {
      const blocks = JSON.parse(window.localStorage.getItem('blocks_' + slideId));
      if (Array.isArray(blocks) && blocks.length > 0) return true;
    } catch {}
  }
  // Scan f_, img_, generic_ keys whose name contains slideId substring
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i);
    if (!k) continue;
    const isField =
      (k.startsWith('f_') || k.startsWith('img_') || k.startsWith('generic_'));
    if (!isField) continue;
    // Only count if it explicitly references this slide id
    if (k.includes(slideId)) {
      const v = window.localStorage.getItem(k);
      if (v && v.length > 0) return true;
    }
  }
  return false;
}

// Aggregate all status across the whole package
export function packageStatus() {
  const byAssignee = {};
  let total = 0;
  let complete = 0;
  let inProgress = 0;

  for (const sl of allSlides) {
    total += 1;
    const assignee = window.localStorage.getItem('assignee_' + sl.id) || '';
    const manualComplete = window.localStorage.getItem('complete_' + sl.id) === 'true';
    const status = slideStatus(sl.id, manualComplete);

    if (status === 'complete') complete += 1;
    if (status === 'in_progress') inProgress += 1;

    const key = assignee || '(unassigned)';
    if (!byAssignee[key]) {
      byAssignee[key] = { complete: 0, in_progress: 0, untouched: 0, slides: [] };
    }
    byAssignee[key][status] += 1;
    byAssignee[key].slides.push({ id: sl.id, num: sl.num, title: sl.title, status, assignee });
  }

  return {
    total,
    complete,
    inProgress,
    untouched: total - complete - inProgress,
    percentComplete: total ? Math.round((complete / total) * 100) : 0,
    byAssignee,
  };
}
