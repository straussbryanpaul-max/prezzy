import Card from '../components/Card.jsx';
import Guidance from '../components/Guidance.jsx';
import BrainDump from '../components/BrainDump.jsx';
import EditableChunk from '../components/EditableChunk.jsx';
import { FormGroup, TextArea } from '../components/Field.jsx';

export default function RisksOpps({ onRedactChange }) {
  return (
    <Card slideId="risks_opps" title="Key Risks and Opportunities" num="00.005" onRedactChange={onRedactChange}>
      <Guidance>
        A simple list of the key risks and opportunities from an estimate perspective.
      </Guidance>
      <EditableChunk id="risks_opps:risks" label="Key Risks">
        <FormGroup label="⚠️ Key Risks">
          <TextArea name="risks" placeholder="List key estimate risks where cost may grow..." rows={6} />
        </FormGroup>
      </EditableChunk>
      <EditableChunk id="risks_opps:opps" label="Key Opportunities">
        <FormGroup label="✅ Key Opportunities">
          <TextArea name="opps" placeholder="List key opportunities where cost may shrink..." rows={6} />
        </FormGroup>
      </EditableChunk>
      <BrainDump slideId="risks_opps" />
    </Card>
  );
}
