import Card from '../components/Card.jsx';
import Guidance from '../components/Guidance.jsx';
import BrainDump from '../components/BrainDump.jsx';
import EditableChunk from '../components/EditableChunk.jsx';
import { FormGroup, Input, TextArea } from '../components/Field.jsx';

export default function SchedBasis({ onRedactChange }) {
  return (
    <Card slideId="sched_basis" title="Schedule Basis & Assumptions" num="02.021" onRedactChange={onRedactChange}>
      <Guidance>
        Describe the schedule development process and include key events and dates.
      </Guidance>
      <EditableChunk id="sched_basis:milestones" label="Key dates table">
        <table className="data-table">
          <thead><tr><th>Date</th><th>Description</th></tr></thead>
          <tbody>
            {Array.from({ length: 8 }).map((_, i) => (
              <tr key={i}>
                <td><Input name={`sd_date_${i}`} type="date" /></td>
                <td><Input name={`sd_desc_${i}`} placeholder="Key milestone description" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </EditableChunk>
      <EditableChunk id="sched_basis:narr" label="Schedule Basis Narrative">
        <FormGroup label="Schedule Basis Narrative">
          <TextArea name="sched_narrative" placeholder="Describe schedule development, target/guaranteed completion, LNTP period..." rows={6} />
        </FormGroup>
      </EditableChunk>
      <BrainDump slideId="sched_basis" />
    </Card>
  );
}
