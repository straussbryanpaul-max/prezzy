import Card from '../components/Card.jsx';
import Guidance from '../components/Guidance.jsx';
import ImageUpload from '../components/ImageUpload.jsx';
import EditableChunk from '../components/EditableChunk.jsx';
import { FormGroup, TextArea } from '../components/Field.jsx';

export default function EstWbs({ onRedactChange }) {
  return (
    <Card slideId="est_wbs" title="Work Breakdown Structure" num="03.018" onRedactChange={onRedactChange}>
      <Guidance>Summarize the estimate structure and WBS logic.</Guidance>
      <EditableChunk id="est_wbs:narr" label="WBS Narrative">
        <FormGroup label="WBS Narrative">
          <TextArea name="wbs_narrative" placeholder="Describe how the estimate is structured and aggregated..." rows={6} />
        </FormGroup>
      </EditableChunk>
      <EditableChunk id="est_wbs:img" label="WBS structure image">
        <ImageUpload name="wbs_structure_img" />
      </EditableChunk>
    </Card>
  );
}
