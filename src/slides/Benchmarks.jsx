import Card from '../components/Card.jsx';
import Guidance from '../components/Guidance.jsx';
import ImageUpload from '../components/ImageUpload.jsx';
import EditableChunk from '../components/EditableChunk.jsx';
import { FormGroup, TextArea } from '../components/Field.jsx';

export default function Benchmarks({ onRedactChange }) {
  return (
    <Card slideId="benchmarks" title="Historical Benchmarks" num="06.005" onRedactChange={onRedactChange}>
      <Guidance>This slide is typically redacted for pre-read.</Guidance>
      <EditableChunk id="benchmarks:narr" label="Benchmark Narrative">
        <FormGroup label="Benchmark Narrative">
          <TextArea name="benchmarks_narrative" placeholder="Describe benchmark sources and relevance..." rows={6} />
        </FormGroup>
      </EditableChunk>
      <EditableChunk id="benchmarks:img" label="Benchmark image">
        <ImageUpload name="benchmarks_img" />
      </EditableChunk>
    </Card>
  );
}
