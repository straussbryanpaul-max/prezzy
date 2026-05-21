import Card from '../components/Card.jsx';
import Guidance from '../components/Guidance.jsx';
import ImageUpload from '../components/ImageUpload.jsx';
import { FormGroup, TextArea } from '../components/Field.jsx';

export default function EstWbs({ onRedactChange }) {
  return (
    <Card slideId="est_wbs" title="Work Breakdown Structure" num="03.018" onRedactChange={onRedactChange}>
      <Guidance>Summarize the estimate structure and WBS logic. Include top-level grouping and key aggregation points.</Guidance>
      <FormGroup label="WBS Narrative">
        <TextArea name="wbs_narrative" placeholder="Describe how the estimate is structured and aggregated..." rows={6} />
      </FormGroup>
      <ImageUpload name="wbs_structure_img" />
    </Card>
  );
}
