import Card from '../components/Card.jsx';
import Guidance from '../components/Guidance.jsx';
import BrainDump from '../components/BrainDump.jsx';
import EditableChunk from '../components/EditableChunk.jsx';
import { TextArea } from '../components/Field.jsx';

const ITEMS = [
  'Overall Scope',
  'Equipment & Bulks',
  'Construction Directs',
  'OSM',
  'Construction Indirects',
  'Home Office Services',
  'Bechtel Field Professional Services',
  'Open Items',
];

export default function EstBasis({ onRedactChange }) {
  return (
    <Card slideId="est_basis" title="Summary Estimate Basis & Open Items" num="00.002" onRedactChange={onRedactChange}>
      <Guidance>
        Provide a high-level summary of the estimate basis for each major scope/cost account area and note any open items.
      </Guidance>
      <EditableChunk id="est_basis:table" label="Estimate Basis table">
        <table className="data-table">
          <thead><tr><th>Scope / Cost Account</th><th>Estimate Basis</th></tr></thead>
          <tbody>
            {ITEMS.map((item, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600, width: 220 }}>{item}</td>
                <td><TextArea name={`eb_${i}`} placeholder={`Describe estimate basis for ${item}`} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </EditableChunk>
      <BrainDump slideId="est_basis" />
    </Card>
  );
}
