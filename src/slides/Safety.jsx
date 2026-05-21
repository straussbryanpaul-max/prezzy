import Card from '../components/Card.jsx';
import ImageUpload from '../components/ImageUpload.jsx';
import { FormGroup, TextArea } from '../components/Field.jsx';

export default function Safety({ onRedactChange }) {
  return (
    <Card slideId="safety" title="Safety Moment" num="Safety" onRedactChange={onRedactChange}>
      <FormGroup label="Safety Moment Topic">
        <TextArea name="safety_topic" placeholder="Enter your safety moment..." rows={6} />
      </FormGroup>
      <ImageUpload name="safety_img" />
    </Card>
  );
}
