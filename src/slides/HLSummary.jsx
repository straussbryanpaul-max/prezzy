import Card from '../components/Card.jsx';
import Guidance from '../components/Guidance.jsx';
import BrainDump from '../components/BrainDump.jsx';
import ImageUpload from '../components/ImageUpload.jsx';
import { FormGroup, FormRow, Input, TextArea } from '../components/Field.jsx';

export default function HLSummary({ onRedactChange }) {
  return (
    <Card slideId="hl_summary" title="High-Level Estimate Summary" num="00.021" onRedactChange={onRedactChange}>
      <Guidance>Summarize total estimate value, major drivers, and the recommended cost position for executive review.</Guidance>
      <FormRow>
        <FormGroup label="Total Estimate"><Input name="hl_total" placeholder="e.g., $XXXM" /></FormGroup>
        <FormGroup label="Contingency / Risk"><Input name="hl_contingency" placeholder="e.g., $XXM" /></FormGroup>
      </FormRow>
      <FormGroup label="Major Cost Drivers"><TextArea name="hl_drivers" placeholder="List primary cost drivers..." /></FormGroup>
      <FormGroup label="Key Assumptions"><TextArea name="hl_assumptions" placeholder="List top assumptions..." /></FormGroup>
      <ImageUpload name="hl_summary_chart" />
      <BrainDump slideId="hl_summary" />
    </Card>
  );
}
