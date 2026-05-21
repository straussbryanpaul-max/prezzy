import Card from '../components/Card.jsx';
import Guidance from '../components/Guidance.jsx';
import BrainDump from '../components/BrainDump.jsx';
import EditableChunk from '../components/EditableChunk.jsx';
import { Select } from '../components/Field.jsx';

const ITEMS = [
  'Obtained 3+ quotes for Mechanical Equipment',
  'Obtained 3+ quotes for Electrical Equipment',
  'Obtained 3+ quotes for Pre-fab Substations',
  'Obtained 3+ quotes for Steel',
  'Obtained 3+ quotes for Pipe',
  'Obtained 3+ quotes for Cable',
  'Obtained 3+ quotes for Instruments',
  'Pricing based on most capable supplier (Mech Equip)',
  'Pricing based on most capable supplier (Elec Equip)',
  'Pricing based on most capable supplier (Steel)',
  'Pricing based on most capable supplier (Pipe)',
  'Direct labor PF based on WBS-level complexity',
  'Unit Rate & PF comparison to ACTUAL projects',
  'Bechtel steel detailing',
  'PLA in place',
  'Craft availability assessment completed',
  'P50 schedule as basis (P80 for unique)',
  'House load costs to P75 duration',
  'Standard escalation model based on procurement forecasts',
  'Currency exposure and hedging in place',
  'Estimate classification demonstrated via venturi chart',
  'Customer specs familiar / similar to previous',
  'Clarity of scope in vendor EP packages',
  'Contingency based on historical MIN/MAX limits',
  'Contingency supplemented by cost sensitivity analysis',
  'Separate risk assessment for risk event costs',
  'Historical data used for optimistic/pessimistic (no Optimism Bias)',
  'Bechtel technology experts reviewed scope',
  'Cold eyes evaluated FOAK and scale-up risks',
  'Lessons learned implemented',
];

export default function DeclinePerf({ onRedactChange }) {
  return (
    <Card slideId="decline_perf" title="Declining Performance Checklist" num="06.008" onRedactChange={onRedactChange}>
      <Guidance>Roll up declining performance checklist and evaluate R/Y/G for each category.</Guidance>
      <EditableChunk id="decline_perf:table" label="Checklist table">
        <table className="data-table">
          <thead><tr><th>Checklist Item</th><th>Status</th></tr></thead>
          <tbody>
            {ITEMS.map((item, i) => (
              <tr key={i}>
                <td style={{ fontSize: 12 }}>{item}</td>
                <td style={{ width: 120 }}>
                  <Select name={`dpc_${i}`} options={['Yes', 'No', 'N/A', 'Partial']} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </EditableChunk>
      <BrainDump slideId="decline_perf" />
    </Card>
  );
}
