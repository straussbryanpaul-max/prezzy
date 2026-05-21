export const sections = [
  {
    id: 's_cover',
    title: 'Cover Page',
    slides: [{ id: 'cover', title: 'Estimate Basis & Presentation', num: 'Title' }],
  },
  {
    id: 's_agenda',
    title: 'Review Agenda',
    slides: [{ id: 'agenda', title: 'Review Agenda', num: 'Agenda' }],
  },
  {
    id: 's_toc',
    title: 'Table of Contents',
    slides: [{ id: 'toc', title: 'Table of Contents', num: 'TOC' }],
  },
  {
    id: 's_safety',
    title: 'Safety Moment',
    slides: [{ id: 'safety', title: 'Safety Moment', num: 'Safety' }],
  },
  {
    id: 's_overview',
    title: '00.000 Project & Estimate Overview',
    slides: [
      { id: 'proj_data', title: 'Project Data', num: '00.001' },
      { id: 'est_basis', title: 'Summary Estimate Basis & Open Items', num: '00.002', preread: true },
      { id: 'site_plan', title: 'Site Plan', num: '00.003' },
      { id: 'est_class', title: 'Estimate Classification', num: '00.004', preread: true },
      { id: 'risks_opps', title: 'Key Risks and Opportunities', num: '00.005', preread: true },
      { id: 'capacity', title: 'Cost per Capacity Metrics', num: '00.006', preread: true },
    ],
  },
  {
    id: 's_commercial',
    title: '00.020 Commercial Summary',
    slides: [
      { id: 'hl_summary', title: 'High-Level Estimate Summary', num: '00.021', preread: true },
      { id: 'sensitivity', title: 'Sensitivity Analysis', num: '00.022' },
      { id: 'exec_cost', title: 'Executive Cost Summary', num: '00.023' },
      { id: 'comparisons', title: 'Project Summary Comparisons', num: '00.024' },
      { id: 'waterfall', title: 'Waterfall Comparison', num: '00.025', preread: true },
      { id: 'currency', title: 'Currency Narrative & Exchange Table', num: '00.026', preread: true },
    ],
  },
  {
    id: 's_engineering',
    title: '01.000 Engineering Basis',
    slides: [{ id: 'design_basis', title: 'Summary Basis of Design', num: '01.001', preread: true }],
  },
  {
    id: 's_execution',
    title: '02.000 Project Execution',
    slides: [
      { id: 'exec_plan', title: 'Execution Plan Summary', num: '02.001', preread: true },
      { id: 'sched_basis', title: 'Schedule Basis & Assumptions', num: '02.021', preread: true },
      { id: 'sched_l1', title: 'Schedule – Level 1', num: '02.022' },
      { id: 'crit_path', title: 'Critical Paths', num: '02.023' },
      { id: 'headcount', title: 'Craft Head Count', num: '02.025' },
      { id: 'sched_metrics', title: 'Schedule Metrics', num: '02.026' },
    ],
  },
  {
    id: 's_estimate_basis',
    title: '03.000 Estimate Basis',
    slides: [
      { id: 'est_general', title: 'General Quantification & Pricing', num: '03.010', preread: true },
      { id: 'est_scas', title: 'SCAS & Contracting Plan', num: '03.017', preread: true },
      { id: 'est_wbs', title: 'Work Breakdown Structure', num: '03.018', preread: true },
      { id: 'disciplines', title: 'Discipline Estimate Basis', num: '03.020–100' },
      { id: 'disc_civil', title: 'Civil Estimate Basis', num: '03.020' },
      { id: 'disc_concrete', title: 'Concrete Estimate Basis', num: '03.040' },
      { id: 'disc_steel', title: 'Steel Estimate Basis', num: '03.050' },
      { id: 'disc_architectural', title: 'Architectural Estimate Basis', num: '03.060' },
      { id: 'disc_mechanical', title: 'Process/Mechanical Estimate Basis', num: '03.070' },
      { id: 'disc_piping', title: 'Piping Estimate Basis', num: '03.080' },
      { id: 'disc_electrical', title: 'Electrical Estimate Basis', num: '03.090' },
      { id: 'disc_instrumentation', title: 'Instrumentation/LSS Estimate Basis', num: '03.100' },
    ],
  },
  {
    id: 's_construction',
    title: '05.000 Construction & Indirects',
    slides: [
      { id: 'unit_rates', title: 'Unit Rate Basis', num: '05.011', preread: true },
      { id: 'labor_strategy', title: 'Craft Labor Strategy', num: '05.012', preread: true },
      { id: 'wage_rates', title: 'Craft Wage Rates Table', num: '05.013' },
      { id: 'indirects', title: 'Indirects Basis of Estimate', num: '05.021', preread: true },
      { id: 'prof_svcs', title: 'Professional Services', num: '05.022' },
      { id: 'staffing', title: 'Staffing Curves', num: '05.046' },
    ],
  },
  {
    id: 's_other_costs',
    title: '06.000 Escalation, Contingency, Risk & Fee',
    slides: [
      { id: 'escalation', title: 'Escalation', num: '06.001' },
      { id: 'contingency', title: 'Contingency', num: '06.002' },
      { id: 'risk_assess', title: 'Risk Assessment', num: '06.003' },
      { id: 'fee', title: 'Fee', num: '06.004', redacted: true },
      { id: 'benchmarks', title: 'Historical Benchmarks', num: '06.005', redacted: true },
      { id: 'other_metrics', title: 'Other Costs Metrics', num: '06.006' },
      { id: 'decline_perf', title: 'Declining Performance Checklist', num: '06.008', preread: true },
    ],
  },
  {
    id: 's_aqe',
    title: '07.000 Assumptions, Qualifications & Exclusions',
    slides: [
      { id: 'aqe', title: 'Assumptions, Qualifications & Exclusions', num: '07.001', preread: true },
      { id: 'trends', title: 'Trends & Late Changes', num: '07.002' },
    ],
  },
  {
    id: 's_appendix',
    title: '08.000 Appendices',
    slides: [{ id: 'appendix', title: 'Appendices', num: '08.000' }],
  },
];

export const allSlides = sections.flatMap(s => s.slides);
