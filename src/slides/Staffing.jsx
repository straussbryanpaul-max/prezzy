import Card from '../components/Card.jsx';
import Guidance from '../components/Guidance.jsx';
import ImageUpload from '../components/ImageUpload.jsx';
import { FormGroup, TextArea } from '../components/Field.jsx';

export default function Staffing({ onRedactChange }) {
  return (
    <Card slideId="staffing" title="Staffing Curves" num="05.046" onRedactChange={onRedactChange}>
      <Guidance>Include a staffing curve summary and narrative on resource build, peak staffing, and labor strategy.</Guidance>
      <FormGroup label="Staffing Curve Narrative">
        <TextArea name="staffing_narrative" placeholder="Describe staffing curves, peaks, and risks..." rows={6} />
      </FormGroup>
      <ImageUpload name="staffing_curve_img" />
    </Card>
  );
}
