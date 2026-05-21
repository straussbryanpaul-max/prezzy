import Card from '../components/Card.jsx';
import Guidance from '../components/Guidance.jsx';
import ImageUpload from '../components/ImageUpload.jsx';
import EditableChunk from '../components/EditableChunk.jsx';
import { FormGroup, TextArea } from '../components/Field.jsx';

export default function DesignBasis({ onRedactChange }) {
  return (
    <Card slideId="design_basis" title="Summary Basis of Design" num="01.001" onRedactChange={onRedactChange}>
      <Guidance>Summarize the design basis, stage of definition, and any assumptions that affect the estimate.</Guidance>
      <EditableChunk id="design_basis:summary" label="Design Basis Summary">
        <FormGroup label="Design Basis Summary">
          <TextArea name="design_basis_summary" placeholder="Describe the design basis and key design drivers..." rows={6} />
        </FormGroup>
      </EditableChunk>
      <EditableChunk id="design_basis:stage" label="Design Stage">
        <FormGroup label="Design Stage / Definition Level">
          <TextArea name="design_stage" placeholder="E.g., 30% FEED, 60% detailed, etc..." />
        </FormGroup>
      </EditableChunk>
      <EditableChunk id="design_basis:img" label="Design basis image">
        <ImageUpload name="design_basis_img" />
      </EditableChunk>
    </Card>
  );
}
