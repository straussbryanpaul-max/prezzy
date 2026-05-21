import Card from '../components/Card.jsx';
import Guidance from '../components/Guidance.jsx';
import ImageUpload from '../components/ImageUpload.jsx';
import EditableChunk from '../components/EditableChunk.jsx';
import { FormGroup, TextArea } from '../components/Field.jsx';

export default function Comparisons({ onRedactChange }) {
  return (
    <Card slideId="comparisons" title="Project Summary Comparisons" num="00.024" onRedactChange={onRedactChange}>
      <Guidance>Show comparatives for the current estimate against benchmark projects or past similar work.</Guidance>
      <EditableChunk id="comparisons:narr" label="Comparison Narrative">
        <FormGroup label="Comparison Narrative">
          <TextArea name="comp_narrative" placeholder="Describe the comparative context and key differentiators..." />
        </FormGroup>
      </EditableChunk>
      <EditableChunk id="comparisons:table_img" label="Comparison table image">
        <ImageUpload name="comp_table_img" />
      </EditableChunk>
      <EditableChunk id="comparisons:chart_img" label="Comparison chart image">
        <ImageUpload name="comp_chart_img" />
      </EditableChunk>
    </Card>
  );
}
