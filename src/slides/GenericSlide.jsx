import Card from '../components/Card.jsx';
import Guidance from '../components/Guidance.jsx';
import BrainDump from '../components/BrainDump.jsx';
import ImageUpload from '../components/ImageUpload.jsx';
import { FormGroup, TextArea } from '../components/Field.jsx';

export default function GenericSlide({ slide, onRedactChange }) {
  return (
    <Card slideId={slide.id} title={slide.title} num={slide.num} onRedactChange={onRedactChange}>
      <Guidance>
        Refer to the Estimate Basis/Review Book Template (MT-GBU-EDT-0019 Rev.C) for detailed
        instructions on this section.
      </Guidance>
      <FormGroup label="Narrative / Content">
        <TextArea name={'generic_' + slide.id} placeholder={'Enter content for ' + slide.title + '...'} rows={8} />
      </FormGroup>
      <ImageUpload name={'generic_img_' + slide.id} />
      <BrainDump slideId={slide.id} />
    </Card>
  );
}
