import Card from '../components/Card.jsx';
import Guidance from '../components/Guidance.jsx';
import BrainDump from '../components/BrainDump.jsx';
import EditableChunk from '../components/EditableChunk.jsx';
import { Input } from '../components/Field.jsx';

const ROWS = [
  ['11', 'Earthwork'], ['12', 'Concrete'], ['13', 'Steel'], ['14', 'Architectural'],
  ['15', 'Pipe'], ['16', 'Electrical'], ['17', 'Instrumentation'], ['18', 'Paint/Fireproof/Insulation'],
  ['19', 'Misc Operations'], ['2x', 'Mechanical Equipment'], ['28', 'Electrical Equipment'], ['3x', 'Specialized Equipment'],
];

export default function WageRates({ onRedactChange }) {
  return (
    <Card slideId="wage_rates" title="Craft Wage Rates Table" num="05.013" onRedactChange={onRedactChange}>
      <Guidance>Provide the basis for wage rate and crew makeup development.</Guidance>
      <EditableChunk id="wage_rates:table" label="Wage rates table">
        <table className="data-table">
          <thead><tr><th>COA</th><th>Description</th><th>Project All-in Rate</th><th>Reference Rate</th><th>Delta</th><th>Notes</th></tr></thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{r[0]}</td>
                <td>{r[1]}</td>
                <td><Input name={`wr_rate_${i}`} placeholder="$" /></td>
                <td><Input name={`wr_ref_${i}`} placeholder="$" /></td>
                <td><Input name={`wr_delta_${i}`} placeholder="$" /></td>
                <td><Input name={`wr_notes_${i}`} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </EditableChunk>
      <BrainDump slideId="wage_rates" />
    </Card>
  );
}
