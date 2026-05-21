import Card from '../components/Card.jsx';
import Guidance from '../components/Guidance.jsx';
import ImageUpload from '../components/ImageUpload.jsx';
import { FormGroup, Input, Select, TextArea } from '../components/Field.jsx';

export default function SchedL1({ onRedactChange }) {
  return (
    <Card slideId="sched_l1" title="Schedule – Level 1" num="02.022" onRedactChange={onRedactChange}>
      <Guidance>Capture the Level 1 master schedule view, including key milestones and completion targets.</Guidance>
      <table className="data-table">
        <thead><tr><th>Milestone</th><th>Date</th><th>Status</th></tr></thead>
        <tbody>
          {Array.from({ length: 6 }).map((_, i) => (
            <tr key={i}>
              <td><Input name={`l1_milestone_${i}`} /></td>
              <td><Input name={`l1_date_${i}`} type="date" /></td>
              <td><Select name={`l1_status_${i}`} options={['Planned', 'Committed', 'At Risk']} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <FormGroup label="L1 Summary">
        <TextArea name="l1_narrative" placeholder="Summarize the level 1 schedule status and logic..." rows={5} />
      </FormGroup>
      <ImageUpload name="l1_schedule_img" />
    </Card>
  );
}
