import Card from '../components/Card.jsx';
import Guidance from '../components/Guidance.jsx';
import ImageUpload from '../components/ImageUpload.jsx';
import EditableChunk from '../components/EditableChunk.jsx';
import { FormGroup, TextArea } from '../components/Field.jsx';

export default function Waterfall({ onRedactChange }) {
  return (
    <Card slideId="waterfall" title="Waterfall Comparison" num="00.025" onRedactChange={onRedactChange}>
      <Guidance>Provide a waterfall or bridge chart summary of estimate reconciliation.</Guidance>
      <EditableChunk id="waterfall:narr" label="Waterfall Narrative">
        <FormGroup label="Waterfall Narrative">
          <TextArea name="waterfall_narr" placeholder="Describe the major movements shown in the waterfall..." />
        </FormGroup>
      </EditableChunk>
      <EditableChunk id="waterfall:img" label="Waterfall image">
        <ImageUpload name="waterfall_img" />
      </EditableChunk>
    </Card>
  );
}
