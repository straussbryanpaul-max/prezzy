import Card from '../components/Card.jsx';
import Guidance from '../components/Guidance.jsx';
import ImageUpload from '../components/ImageUpload.jsx';
import { FormGroup, TextArea } from '../components/Field.jsx';

export default function CritPath({ onRedactChange }) {
  return (
    <Card slideId="crit_path" title="Critical Paths" num="02.023" onRedactChange={onRedactChange}>
      <Guidance>List primary critical paths, long lead dependencies, and any known schedule risks.</Guidance>
      <FormGroup label="Primary Critical Path">
        <TextArea name="crit_primary" placeholder="Describe the primary critical path..." rows={4} />
      </FormGroup>
      <FormGroup label="Secondary Critical Path">
        <TextArea name="crit_secondary" placeholder="Describe the secondary critical path..." rows={4} />
      </FormGroup>
      <ImageUpload name="crit_path_img" />
    </Card>
  );
}
