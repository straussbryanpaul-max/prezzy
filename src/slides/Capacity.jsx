import Card from '../components/Card.jsx';
import Guidance from '../components/Guidance.jsx';
import BrainDump from '../components/BrainDump.jsx';
import ImageUpload from '../components/ImageUpload.jsx';
import EditableChunk from '../components/EditableChunk.jsx';
import { FormGroup, FormRow, Input, TextArea } from '../components/Field.jsx';

export default function Capacity({ onRedactChange }) {
  return (
    <Card slideId="capacity" title="Cost per Capacity Metrics" num="00.006" onRedactChange={onRedactChange}>
      <Guidance>Standard factored metrics for facility capacity — $/SF, $/MW, etc.</Guidance>
      <EditableChunk id="capacity:metrics" label="$/SF and $/MW fields">
        <FormRow>
          <FormGroup label="$/SF"><Input name="cost_sf" placeholder="e.g., $450/SF" /></FormGroup>
          <FormGroup label="$/MW"><Input name="cost_mw" placeholder="e.g., $12M/MW" /></FormGroup>
        </FormRow>
      </EditableChunk>
      <EditableChunk id="capacity:narr" label="Narrative">
        <FormGroup label="Narrative">
          <TextArea name="capacity_narrative" placeholder="Describe capacity metrics and comparison to benchmarks..." />
        </FormGroup>
      </EditableChunk>
      <EditableChunk id="capacity:img" label="Image">
        <ImageUpload name="capacity_img" />
      </EditableChunk>
      <BrainDump slideId="capacity" />
    </Card>
  );
}
