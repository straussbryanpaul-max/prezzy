import Card from '../components/Card.jsx';
import Guidance from '../components/Guidance.jsx';
import ImageUpload from '../components/ImageUpload.jsx';
import EditableChunk from '../components/EditableChunk.jsx';
import { FormGroup, TextArea } from '../components/Field.jsx';

export default function Fee({ onRedactChange }) {
  return (
    <Card slideId="fee" title="Fee" num="06.004" onRedactChange={onRedactChange}>
      <Guidance>Fee is typically excluded from pre-read materials and marked redacted.</Guidance>
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
