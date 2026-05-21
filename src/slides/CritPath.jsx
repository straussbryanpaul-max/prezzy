import Card from '../components/Card.jsx';
import Guidance from '../components/Guidance.jsx';
import ImageUpload from '../components/ImageUpload.jsx';
import EditableChunk from '../components/EditableChunk.jsx';
import { FormGroup, TextArea } from '../components/Field.jsx';

export default function CritPath({ onRedactChange }) {
  return (
    <Card slideId="crit_path" title="Critical Paths" num="02.023" onRedactChange={onRedactChange}>
      <Guidance>List primary critical paths, long lead dependencies, and any known schedule risks.</Guidance>
      <EditableChunk id="crit_path:primary" label="Primary Critical Path">
        <FormGroup label="Primary Critical Path">
          <TextArea name="crit_primary" placeholder="Describe the primary critical path..." rows={4} />
        </FormGroup>
      </EditableChunk>
      <EditableChunk id="crit_path:secondary" label="Secondary Critical Path">
        <FormGroup label="Secondary Critical Path">
          <TextArea name="crit_secondary" placeholder="Describe the secondary critical path..." rows={4} />
        </FormGroup>
      </EditableChunk>
      <EditableChunk id="crit_path:img" label="Critical path image">
        <ImageUpload name="crit_path_img" />
      </EditableChunk>
    </Card>
  );
}
