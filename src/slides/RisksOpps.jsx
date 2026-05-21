import Card from '../components/Card.jsx';
import Guidance from '../components/Guidance.jsx';
import BrainDump from '../components/BrainDump.jsx';
import { FormGroup, TextArea } from '../components/Field.jsx';

export default function RisksOpps({ onRedactChange }) {
  return (
    <Card slideId="risks_opps" title="Key Risks and Opportunities" num="00.005" onRedactChange={onRedactChange}>
      <Guidance>
        A simple list of the key risks and opportunities from an estimate perspective, where there are risks for the cost to grow
        and opportunities where the cost may shrink.
      </Guidance>
      <FormGroup label="⚠️ Key Risks">
        <TextArea name="risks" placeholder="List key estimate risks where cost may grow..." rows={6} />
      </FormGroup>
      <FormGroup label="✅ Key Opportunities">
        <TextArea name="opps" placeholder="List key opportunities where cost may shrink..." rows={6} />
      </FormGroup>
      <BrainDump slideId="risks_opps" />
    </Card>
  );
}
