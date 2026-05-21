import Card from '../components/Card.jsx';
import Guidance from '../components/Guidance.jsx';
import BrainDump from '../components/BrainDump.jsx';
import ImageUpload from '../components/ImageUpload.jsx';
import { FormGroup, Input } from '../components/Field.jsx';

export default function SitePlan({ onRedactChange }) {
  return (
    <Card slideId="site_plan" title="Site Plan" num="00.003" onRedactChange={onRedactChange}>
      <Guidance>Consider inclusion of "acres of construction" value to demonstrate size of site area.</Guidance>
      <FormGroup label="Site Area (acres)"><Input name="site_acres" placeholder="e.g., 150 acres" /></FormGroup>
      <ImageUpload name="site_plan" />
      <BrainDump slideId="site_plan" />
    </Card>
  );
}
