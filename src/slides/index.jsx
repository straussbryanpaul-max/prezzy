import GenericSlide from './GenericSlide.jsx';
import { allSlides } from '../data/sections.js';
import { DISCIPLINES } from '../data/constants.js';
import DisciplineSlide from './DisciplineSlide.jsx';
import CustomSlide from './CustomSlide.jsx';

import Cover from './Cover.jsx';
import Agenda from './Agenda.jsx';
import TOC from './TOC.jsx';
import Safety from './Safety.jsx';
import ProjectData from './ProjectData.jsx';
import EstBasis from './EstBasis.jsx';
import SitePlan from './SitePlan.jsx';
import EstClass from './EstClass.jsx';
import RisksOpps from './RisksOpps.jsx';
import Capacity from './Capacity.jsx';
import HLSummary from './HLSummary.jsx';
import Sensitivity from './Sensitivity.jsx';
import ExecCost from './ExecCost.jsx';
import Comparisons from './Comparisons.jsx';
import Waterfall from './Waterfall.jsx';
import Currency from './Currency.jsx';
import DesignBasis from './DesignBasis.jsx';
import ExecPlan from './ExecPlan.jsx';
import SchedBasis from './SchedBasis.jsx';
import SchedL1 from './SchedL1.jsx';
import CritPath from './CritPath.jsx';
import Headcount from './Headcount.jsx';
import SchedMetrics from './SchedMetrics.jsx';
import EstGeneral from './EstGeneral.jsx';
import EstScas from './EstScas.jsx';
import EstWbs from './EstWbs.jsx';
// DisciplinesIndex removed — each discipline now has its own sidebar entry instead
import WageRates from './WageRates.jsx';
import Indirects from './Indirects.jsx';
import ProfSvcs from './ProfSvcs.jsx';
import Staffing from './Staffing.jsx';
import Escalation from './Escalation.jsx';
import Contingency from './Contingency.jsx';
import RiskAssess from './RiskAssess.jsx';
import Fee from './Fee.jsx';
import Benchmarks from './Benchmarks.jsx';
import OtherMetrics from './OtherMetrics.jsx';
import DeclinePerf from './DeclinePerf.jsx';
import Aqe from './Aqe.jsx';
import Trends from './Trends.jsx';
import Appendix from './Appendix.jsx';

const COMPONENT_MAP = {
  cover: Cover,
  agenda: Agenda,
  toc: TOC,
  safety: Safety,
  proj_data: ProjectData,
  est_basis: EstBasis,
  site_plan: SitePlan,
  est_class: EstClass,
  risks_opps: RisksOpps,
  capacity: Capacity,
  hl_summary: HLSummary,
  sensitivity: Sensitivity,
  exec_cost: ExecCost,
  comparisons: Comparisons,
  waterfall: Waterfall,
  currency: Currency,
  design_basis: DesignBasis,
  exec_plan: ExecPlan,
  sched_basis: SchedBasis,
  sched_l1: SchedL1,
  crit_path: CritPath,
  headcount: Headcount,
  sched_metrics: SchedMetrics,
  est_general: EstGeneral,
  est_scas: EstScas,
  est_wbs: EstWbs,
  wage_rates: WageRates,
  indirects: Indirects,
  prof_svcs: ProfSvcs,
  staffing: Staffing,
  escalation: Escalation,
  contingency: Contingency,
  risk_assess: RiskAssess,
  fee: Fee,
  benchmarks: Benchmarks,
  other_metrics: OtherMetrics,
  decline_perf: DeclinePerf,
  aqe: Aqe,
  trends: Trends,
  appendix: Appendix,
};

export default function SlideRouter({ slideId, onRedactChange, onNavigateHome }) {
  // Custom (user-created) slides
  if (slideId.startsWith('custom_')) {
    return (
      <CustomSlide
        slideId={slideId}
        onRedactChange={onRedactChange}
        onNavigateHome={onNavigateHome}
      />
    );
  }

  // Discipline detail slides: disc_civil, disc_concrete, etc.
  if (slideId.startsWith('disc_')) {
    const discId = slideId.slice(5);
    const d = DISCIPLINES.find(x => x.id === discId);
    if (d) return <DisciplineSlide discipline={d} onRedactChange={onRedactChange} />;
  }

  const Comp = COMPONENT_MAP[slideId];
  const slide = allSlides.find(s => s.id === slideId);

  if (Comp) return <Comp onRedactChange={onRedactChange} />;
  if (slide) return <GenericSlide slide={slide} onRedactChange={onRedactChange} />;
  return <div>Slide not found: {slideId}</div>;
}
