// Block → plain-text helpers used by the references drawer and library.
// Kept separate from references.js so the storage layer stays UI-agnostic.

export function blockToText(block) {
  if (!block || !block.data) return '';
  switch (block.type) {
    case 'text':
      return (block.data.text || '').trim();
    case 'table': {
      const headers = block.data.headers || [];
      const cells = block.data.cells || [];
      const rows = [headers, ...cells];
      return rows.map(r => r.join('\t')).join('\n');
    }
    case 'file':
      return block.data.name || '';
    case 'pbi':
      return block.data.url || block.data.embedUrl || '';
    case 'image':
      // Don't dump base64. Caller treats empty as "not copyable as text".
      return '';
    case 'shape':
      return block.data.emoji ? `${block.data.emoji}` : '';
    default:
      return '';
  }
}

export function blockSummary(block) {
  if (!block) return '';
  switch (block.type) {
    case 'text': {
      const t = (block.data?.text || '').trim();
      if (!t) return '(empty)';
      return t.length > 80 ? t.slice(0, 80) + '…' : t;
    }
    case 'table': {
      const r = block.data?.cells?.length || 0;
      const c = block.data?.headers?.length || 0;
      return `${r} rows × ${c} cols`;
    }
    case 'image':
      return '(image)';
    case 'file':
      return block.data?.name || '(file)';
    case 'pbi':
      return block.data?.url ? 'Power BI embed' : '(empty Power BI)';
    case 'shape':
      return `${block.data?.emoji || ''} shape`;
    default:
      return block.type;
  }
}
