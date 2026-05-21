import Card from '../components/Card.jsx';
import Guidance from '../components/Guidance.jsx';
import ImageUpload from '../components/ImageUpload.jsx';
import { FormGroup, TextArea } from '../components/Field.jsx';

export default function Benchmarks({ onRedactChange }) {
  return (
    <Card slideId="benchmarks" title="Historical Benchmarks" num="06.005" onRedactChange={onRedactChange}>
      <Guidance>This slide is typically redacted for pre-read. Document benchmark sources and comparisons for restricted review only.</Guidance>
      <FormGroup label="Benchmark Narrative">
        <TextArea name="benchmarks_narrative" placeholder="Describe benchmark sources and relevance..." rows={6} />
      </FormGroup>
      <ImageUpload name="benchmarks_img" />
    </Card>
  );
}
