import Card from '../components/Card.jsx';
import Guidance from '../components/Guidance.jsx';
import ImageUpload from '../components/ImageUpload.jsx';
import EditableChunk from '../components/EditableChunk.jsx';
import { FormGroup, TextArea } from '../components/Field.jsx';

export default function Fee({ onRedactChange }) {
  return (
    <Card slideId="fee" title="Fee" num="06.004" onRedactChange={onRedactChange}>
      <Guidance>Describe the fee basis, margin strategy, and any exclusions from the fee scope.</Guidance>
      <EditableChunk id="fee:narr" label="Fee Basis Narrative">
        <FormGroup label="Fee Basis Narrative">
          <TextArea name="fee_narrative" placeholder="Describe fee strategy, margin, and exclusions..." rows={5} />
        </FormGroup>
      </EditableChunk>
      <EditableChunk id="fee:img" label="Fee image">
        <ImageUpload name="fee_img" />
      </EditableChunk>
    </Card>
  );
}
