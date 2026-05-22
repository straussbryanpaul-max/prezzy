import Card from '../components/Card.jsx';
import ImageUpload from '../components/ImageUpload.jsx';
import EditableChunk from '../components/EditableChunk.jsx';
import SafetyGenerator from '../components/SafetyGenerator.jsx';
import { FormGroup, TextArea } from '../components/Field.jsx';

export default function Safety({ onRedactChange }) {
  return (
    <Card slideId="safety" title="Safety Moment" num="Safety" onRedactChange={onRedactChange}>
      <EditableChunk id="safety:generator" label="AI generator">
        <SafetyGenerator />
      </EditableChunk>
      <EditableChunk id="safety:topic" label="Safety Moment Topic">
        <FormGroup label="Safety Moment Topic">
          <TextArea name="safety_topic" placeholder="Enter your safety moment..." rows={8} />
        </FormGroup>
      </EditableChunk>
      <EditableChunk id="safety:img" label="Image">
        <ImageUpload name="safety_img" />
      </EditableChunk>
    </Card>
  );
}
