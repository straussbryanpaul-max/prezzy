export const DISCIPLINES = [
  { id: 'civil', name: 'Civil', code: '03.020' },
  { id: 'concrete', name: 'Concrete', code: '03.040' },
  { id: 'steel', name: 'Steel', code: '03.050' },
  { id: 'architectural', name: 'Architectural', code: '03.060' },
  { id: 'mechanical', name: 'Process/Mechanical', code: '03.070' },
  { id: 'piping', name: 'Piping', code: '03.080' },
  { id: 'electrical', name: 'Electrical', code: '03.090' },
  { id: 'instrumentation', name: 'Instrumentation/LSS', code: '03.100' },
];

export const ESTIMATE_CLASSES = [
  'Class 1 - Definitive',
  "Class 2 - Engineer's",
  'Class 3 - Preliminary',
  'Class 4 - Feasibility',
  'Class 5 - Conceptual',
];

export const CONTRACT_TYPES = ['LSTK', 'EPC', 'EPCM', 'Cost Reimbursable', 'GMP', 'T&M'];

export const CONSTRUCTION_ENTITIES = ['BCC', 'Becon', 'BCOI', 'Subcontract', 'Direct Hire'];

export const LABOR_TYPES = ['Union', 'Open Shop', 'Merit Shop', 'Mixed'];

export const WORK_WEEKS = [
  '5-8s (40hr)',
  '4-10s (40hr)',
  '5-10s (50hr)',
  '6-10s (60hr)',
  '5-8s + Sat OT',
  '6-10s + Sun OT',
];

export const MTO_METHODS = [
  'Material Take-off (Engineered)',
  'Factored by Estimating',
  'Allowance',
  'Vendor Supplied',
  'Historical Reference',
  'Subcontractor Provided',
];

export const PRICING_LEVELS = [
  'Level 1 - Firm',
  'Level 2 - Budget',
  'Level 3 - Informal',
  'Level 4 - In-house',
  '+/-0%',
  'Historical',
];

export const REVIEW_TYPES = [
  "Estimating Manager's Review",
  'Project Management Team Review',
  'Functional Management Review',
  'GBU Senior Management Review',
  "GBU President's Review",
  'Scope & Quantity Review',
];

export const BECHTEL_ENTITIES = [
  'Bechtel Construction Company (BCC)',
  'Bechtel Equipment Operations (Becon)',
  'Bechtel Corporation',
  'Bechtel Global Corporation',
  'Bechtel India',
  'Bechtel Oil, Gas & Chemicals',
];

export const PERFORMING_OFFICES = [
  'Houston',
  'Reston',
  'London',
  'New Delhi',
  'Brisbane',
  'Frederick',
  'Knoxville',
  'San Francisco',
];

export const SHAPES = {
  callouts: ['💬', '📢', '📣', '🔔', '⚠️', '🚨', '📌', '📍', '🏷️', '🎯', '💡', '🔑'],
  flow: ['➡️', '⬆️', '🔄', '🔃', '↩️', '🔁', '⏩', '▶️', '⏸️', '⏭️', '🔀', '🔂'],
  status: ['✅', '❌', '⭕', '🔴', '🟡', '🟢', '🔵', '🟠', '🟣', '⚫', '⚪', '🔷'],
};

export const SHAPE_COLORS = [
  '#1E2D38',
  '#E8290B',
  '#0078D4',
  '#00A3A1',
  '#10B981',
  '#F59E0B',
  '#8B5CF6',
  '#EC4899',
  '#64748B',
  '#fff',
];

export const PBI_SLIDES = [
  'design_basis',
  'sched_metrics',
  'disciplines',
  'prof_svcs',
  'staffing',
  'contingency',
  'sensitivity',
];
