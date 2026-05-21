import { sections, allSlides } from '../data/sections.js';
import { lsGet } from '../hooks/useLocalStorage.js';

// Collect every f_* (form) and bd_* (brain dump) value from localStorage
// along with the slide structure so AI has full context.
export function collectAllProjectData() {
  const data = {
    projectName: lsGet('f_project_name', 'Unnamed Project'),
    clientName: lsGet('f_client_name', ''),
    estimateClass: lsGet('f_est_class', ''),
    globalNotes: lsGet('estimatorNotes', ''),
    slides: [],
  };

  for (const sec of sections) {
    for (const sl of sec.slides) {
      const slideData = {
        section: sec.title,
        id: sl.id,
        num: sl.num,
        title: sl.title,
        redacted: sl.redacted || lsGet('redact_' + sl.id, '') === 'true',
        fields: {},
        brainDump: lsGet('bd_' + sl.id, ''),
      };
      // Scan localStorage for any f_* keys that look like they belong to this slide
      // (heuristic: not all fields have slide-id prefixes, but many do)
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i);
        if (!k?.startsWith('f_')) continue;
        const v = window.localStorage.getItem(k);
        if (!v) continue;
        // Loose match: include all f_ keys in a single bucket — AI will sort them
        slideData.fields[k.slice(2)] = v;
      }
      data.slides.push(slideData);
    }
  }
  return data;
}

// Build the AI prompt to convert raw data into a formal Basis of Estimate.
function buildPrompt(data) {
  const compact = {
    projectName: data.projectName,
    clientName: data.clientName,
    estimateClass: data.estimateClass,
    globalNotes: data.globalNotes,
    slides: data.slides
      .filter(s => s.brainDump || Object.keys(s.fields).length > 0)
      .map(s => ({
        section: s.section,
        title: s.title,
        num: s.num,
        redacted: s.redacted,
        notes: s.brainDump,
      })),
  };

  return `You are an expert EPC construction estimator generating a formal Basis of Estimate (BOE) document for management review.

Below is the raw data collected from the BOE review book builder. Convert it into a coherent, formal, third-person narrative document organized by section. Each section should have a heading and 1-3 polished paragraphs. Flag any unconfirmed items with [TBD].

Do NOT include sections marked redacted=true unless the data is non-sensitive.

PROJECT DATA:
${JSON.stringify(compact, null, 2)}

Return ONLY the document in this exact structure (no preamble, no markdown code fences):

# Basis of Estimate — {project name}
**Client:** {client}
**Estimate Class:** {class}
**Date:** {today}

## Executive Summary
{2-3 paragraphs}

## Project Overview
{content}

## Estimate Basis
{content}

## Construction & Indirects
{content}

## Schedule
{content}

## Risk, Contingency & Fee
{content}

## Assumptions, Qualifications & Exclusions
{content}

## Appendices
{content if any}
`;
}

// Strip-down markdown → HTML for Word: # ## ###, **bold**, paragraphs
function mdToHtml(md) {
  const lines = md.split('\n');
  let html = '';
  let inList = false;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      continue;
    }

    if (line.startsWith('# ')) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<h1 style="font-family:Calibri,Arial,sans-serif;color:#1E2D38;border-bottom:2px solid #E8290B;padding-bottom:6px;">${escapeHtml(line.slice(2))}</h1>`;
    } else if (line.startsWith('## ')) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<h2 style="font-family:Calibri,Arial,sans-serif;color:#1E2D38;margin-top:24px;">${escapeHtml(line.slice(3))}</h2>`;
    } else if (line.startsWith('### ')) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<h3 style="font-family:Calibri,Arial,sans-serif;color:#0078D4;">${escapeHtml(line.slice(4))}</h3>`;
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList) { html += '<ul>'; inList = true; }
      html += `<li style="font-family:Calibri,Arial,sans-serif;">${formatInline(line.slice(2))}</li>`;
    } else {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<p style="font-family:Calibri,Arial,sans-serif;font-size:11pt;line-height:1.5;">${formatInline(line)}</p>`;
    }
  }
  if (inList) html += '</ul>';
  return html;
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function formatInline(s) {
  // **bold**
  return escapeHtml(s).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

// Download an HTML payload as a .doc (Word-compatible) file.
function downloadAsWord(html, projectName) {
  const safeName = (projectName || 'Project').replace(/[^a-z0-9_-]+/gi, '_');
  const wrap = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
                      xmlns:w="urn:schemas-microsoft-com:office:word"
                      xmlns="http://www.w3.org/TR/REC-html40">
  <head>
    <meta charset="utf-8">
    <title>Basis of Estimate</title>
    <!--[if gte mso 9]><xml>
      <w:WordDocument>
        <w:View>Print</w:View>
        <w:Zoom>100</w:Zoom>
      </w:WordDocument>
    </xml><![endif]-->
    <style>
      @page { size: Letter; margin: 1in; }
      body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; color: #222; }
    </style>
  </head>
  <body>${html}</body>
</html>`;
  const blob = new Blob(['﻿', wrap], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${safeName}_Basis_of_Estimate.doc`;
  a.click();
  URL.revokeObjectURL(url);
}

// Main entry point. Returns Promise<{ok, message}>.
export async function exportFormalBasis({ onStatus } = {}) {
  const data = collectAllProjectData();
  const apiKey = window._apiKey || '';

  onStatus?.('Collecting project data...', 'var(--orange)');
  await new Promise(r => setTimeout(r, 200));

  let markdown;
  if (apiKey) {
    onStatus?.('Asking AI to draft the formal Basis of Estimate...', 'var(--orange)');
    try {
      const prompt = buildPrompt(data);
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5',
          max_tokens: 4000,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`API ${res.status}: ${errText.slice(0, 200)}`);
      }
      const json = await res.json();
      markdown = json.content?.map(c => c.text || '').join('') || '';
      if (!markdown) throw new Error('Empty response from AI');
    } catch (e) {
      onStatus?.('AI call failed: ' + e.message, 'var(--red)');
      // Fall through to a raw dump instead
      markdown = buildRawDump(data);
    }
  } else {
    onStatus?.('No API key — generating raw data dump (add API key for AI-formatted narrative).', 'var(--orange)');
    markdown = buildRawDump(data);
  }

  const html = mdToHtml(markdown);
  downloadAsWord(html, data.projectName);
  onStatus?.('Word document downloaded ✓');
  return { ok: true };
}

function buildRawDump(data) {
  let md = `# Basis of Estimate — ${data.projectName}\n`;
  md += `**Client:** ${data.clientName || '[TBD]'}\n`;
  md += `**Estimate Class:** ${data.estimateClass || '[TBD]'}\n`;
  md += `**Date:** ${new Date().toLocaleDateString()}\n\n`;

  if (data.globalNotes) {
    md += `## Global Notes\n${data.globalNotes}\n\n`;
  }

  let currentSection = '';
  for (const sl of data.slides) {
    if (sl.redacted) continue;
    if (!sl.brainDump && Object.values(sl.fields).every(v => !v)) continue;
    if (sl.section !== currentSection) {
      md += `\n## ${sl.section}\n`;
      currentSection = sl.section;
    }
    md += `\n### ${sl.num} — ${sl.title}\n`;
    if (sl.brainDump) md += `${sl.brainDump}\n`;
  }
  md += '\n---\n_Generated by Basis of Estimate Builder. Add an Anthropic API key in the top bar to enable AI-formatted narrative output._\n';
  return md;
}
