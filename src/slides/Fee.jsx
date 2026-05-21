import Card from '../components/Card.jsx';
import Guidance from '../components/Guidance.jsx';
import ImageUpload from '../components/ImageUpload.jsx';
import { FormGroup, TextArea } from '../components/Field.jsx';

export default function Fee({ onRedactChange }) {
  return (
    <Card slideId="fee" title="Fee" num="06.004" onRedactChange={onRedactChange}>
      <Guidance>
        Fee is typically excluded from pre-read materials and marked redacted. Capture the fee basis and exclusion notes for
        restricted review.
      </Guidance>
      <FormGroup label="Fee Basis Narrative">
        <TextArea name="fee_narrative" placeholder="Describe fee strategy, margin, and exclusions..." rows={5} />
      </FormGroup>
      <ImageUpload name="fee_img" />
    </Card>
  );
}
