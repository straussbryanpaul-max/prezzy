import Card from '../components/Card.jsx';
import Guidance from '../components/Guidance.jsx';
import EditableChunk from '../components/EditableChunk.jsx';
import { FormGroup, Input, TextArea } from '../components/Field.jsx';

export default function RiskAssess({ onRedactChange }) {
  return (
    <Card slideId="risk_assess" title="Risk Assessment" num="06.003" onRedactChange={onRedactChange}>
      <Guidance>Summarize risk assessment findings, risk register highlights, and whether risk value is included in the estimate.</Guidance>
      <EditableChunk id="risk_assess:summary" label="Risk Assessment Summary">
        <FormGroup label="Risk Assessment Summary">
          <TextArea name="risk_summary" placeholder="Summarize risk assessment results..." rows={6} />
        </FormGroup>
      </EditableChunk>
      <EditableChunk id="risk_assess:table" label="Risk register table">
        <table className="data-table">
          <thead><tr><th>Risk Area</th><th>Impact</th><th>Mitigation</th></tr></thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                <td><Input name={`risk_area_${i}`} /></td>
                <td><Input name={`risk_impact_${i}`} /></td>
                <td><TextArea name={`risk_mitigation_${i}`} rows={2} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </EditableChunk>
    </Card>
  );
}
