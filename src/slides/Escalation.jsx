import Card from '../components/Card.jsx';
import Guidance from '../components/Guidance.jsx';
import EditableChunk from '../components/EditableChunk.jsx';
import { FormGroup, Input, TextArea } from '../components/Field.jsx';

export default function Escalation({ onRedactChange }) {
  return (
    <Card slideId="escalation" title="Escalation" num="06.001" onRedactChange={onRedactChange}>
      <Guidance>Describe the escalation model, indices, assumptions, and base date used for the estimate.</Guidance>
      <EditableChunk id="escalation:narr" label="Escalation Narrative">
        <FormGroup label="Escalation Narrative">
          <TextArea name="escalation_narrative" placeholder="Describe escalation basis and assumptions..." rows={6} />
        </FormGroup>
      </EditableChunk>
      <EditableChunk id="escalation:table" label="Escalation table">
        <table className="data-table">
          <thead><tr><th>Escalation Item</th><th>Assumption</th><th>Rate</th></tr></thead>
          <tbody>
            {Array.from({ length: 4 }).map((_, i) => (
              <tr key={i}>
                <td><Input name={`esc_item_${i}`} /></td>
                <td><Input name={`esc_assumption_${i}`} /></td>
                <td><Input name={`esc_rate_${i}`} placeholder="%" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </EditableChunk>
    </Card>
  );
}
