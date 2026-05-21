import Card from '../components/Card.jsx';
import Guidance from '../components/Guidance.jsx';
import EditableChunk from '../components/EditableChunk.jsx';
import { FormGroup, Input, TextArea } from '../components/Field.jsx';

const SERVICES = ['Engineering Support', 'Project Management', 'Commissioning', 'Specialty Consultants'];

export default function ProfSvcs({ onRedactChange }) {
  return (
    <Card slideId="prof_svcs" title="Professional Services" num="05.022" onRedactChange={onRedactChange}>
      <Guidance>Capture the basis for professional services.</Guidance>
      <EditableChunk id="prof_svcs:narr" label="Professional Services Narrative">
        <FormGroup label="Professional Services Narrative">
          <TextArea name="prof_narrative" placeholder="Describe professional services scope and basis..." rows={6} />
        </FormGroup>
      </EditableChunk>
      <EditableChunk id="prof_svcs:table" label="Professional services table">
        <table className="data-table">
          <thead><tr><th>Service</th><th>Basis</th><th>Cost</th></tr></thead>
          <tbody>
            {SERVICES.map((item, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{item}</td>
                <td><TextArea name={`prof_basis_${i}`} /></td>
                <td><Input name={`prof_cost_${i}`} placeholder="$" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </EditableChunk>
    </Card>
  );
}
