import Card from '../components/Card.jsx';
import Guidance from '../components/Guidance.jsx';
import ImageUpload from '../components/ImageUpload.jsx';
import { FormGroup, TextArea } from '../components/Field.jsx';

export default function Comparisons({ onRedactChange }) {
  return (
    <Card slideId="comparisons" title="Project Summary Comparisons" num="00.024" onRedactChange={onRedactChange}>
      <Guidance>Show comparatives for the current estimate against benchmark projects or past similar work. Add supporting tables or charts.</Guidance>
      <FormGroup label="Comparison Narrative">
        <TextArea name="comp_narrative" placeholder="Describe the comparative context and key differentiators..." />
      </FormGroup>
      <ImageUpload name="comp_table_img" />
      <ImageUpload name="comp_chart_img" />
    </Card>
  );
}
