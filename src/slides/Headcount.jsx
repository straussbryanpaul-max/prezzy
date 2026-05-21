import Card from '../components/Card.jsx';
import Guidance from '../components/Guidance.jsx';
import EditableChunk from '../components/EditableChunk.jsx';
import { FormGroup, Input, TextArea } from '../components/Field.jsx';

export default function Headcount({ onRedactChange }) {
  return (
    <Card slideId="headcount" title="Craft Head Count" num="02.025" onRedactChange={onRedactChange}>
      <Guidance>Show planned craft headcount build-up, peak staffing levels, and hiring risks.</Guidance>
      <EditableChunk id="headcount:table" label="Headcount table">
        <table className="data-table">
          <thead><tr><th>Week</th><th>Craft Headcount</th><th>Notes</th></tr></thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, i) => (
              <tr key={i}>
                <td><Input name={`hc_week_${i}`} /></td>
                <td><Input name={`hc_count_${i}`} /></td>
                <td><Input name={`hc_notes_${i}`} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </EditableChunk>
      <EditableChunk id="headcount:narr" label="Headcount Commentary">
        <FormGroup label="Headcount Commentary">
          <TextArea name="hc_narrative" placeholder="Comment on headcount ramp and risks..." />
        </FormGroup>
      </EditableChunk>
    </Card>
  );
}
