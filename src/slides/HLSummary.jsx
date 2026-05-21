import Card from '../components/Card.jsx';
import Guidance from '../components/Guidance.jsx';
import BrainDump from '../components/BrainDump.jsx';
import ImageUpload from '../components/ImageUpload.jsx';
import EditableChunk from '../components/EditableChunk.jsx';
import { FormGroup, FormRow, Input, TextArea } from '../components/Field.jsx';

export default function HLSummary({ onRedactChange }) {
  return (
    <Card slideId="hl_summary" title="High-Level Estimate Summary" num="00.021" onRedactChange={onRedactChange}>
      <Guidance>Summarize total estimate value, major drivers, and the recommended cost position for executive review.</Guidance>
      <EditableChunk id="hl_summary:totals" label="Total / Contingency fields">
        <FormRow>
          <FormGroup label="Total Estimate"><Input name="hl_total" placeholder="e.g., $XXXM" /></FormGroup>
          <FormGroup label="Contingency / Risk"><Input name="hl_contingency" placeholder="e.g., $XXM" /></FormGroup>
        </FormRow>
      </EditableChunk>
      <EditableChunk id="hl_summary:drivers" label="Major Cost Drivers">
        <FormGroup label="Major Cost Drivers"><TextArea name="hl_drivers" placeholder="List primary cost drivers..." /></FormGroup>
      </EditableChunk>
      <EditableChunk id="hl_summary:assumptions" label="Key Assumptions">
        <FormGroup label="Key Assumptions"><TextArea name="hl_assumptions" placeholder="List top assumptions..." /></FormGroup>
      </EditableChunk>
      <EditableChunk id="hl_summary:chart" label="Summary chart">
        <ImageUpload name="hl_summary_chart" />
      </EditableChunk>
      <BrainDump slideId="hl_summary" />
    </Card>
  );
}
