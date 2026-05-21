import Card from '../components/Card.jsx';
import Guidance from '../components/Guidance.jsx';
import ImageUpload from '../components/ImageUpload.jsx';
import EditableChunk from '../components/EditableChunk.jsx';
import { FormGroup, TextArea } from '../components/Field.jsx';

export default function Appendix({ onRedactChange }) {
  return (
    <Card slideId="appendix" title="Appendices" num="08.000" onRedactChange={onRedactChange}>
      <Guidance>Use this section for supporting material, definitions, data sources, and attachments.</Guidance>
      <EditableChunk id="appendix:notes" label="Appendix Notes">
        <FormGroup label="Appendix Notes">
          <TextArea name="appendix_notes" placeholder="List supporting documents, data sources, and attachments..." />
        </FormGroup>
      </EditableChunk>
      <EditableChunk id="appendix:img" label="Appendix image">
        <ImageUpload name="appendix_img" />
      </EditableChunk>
    </Card>
  );
}
