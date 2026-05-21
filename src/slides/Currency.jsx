import Card from '../components/Card.jsx';
import Guidance from '../components/Guidance.jsx';
import EditableChunk from '../components/EditableChunk.jsx';
import { FormGroup, FormRow, Input, TextArea } from '../components/Field.jsx';

export default function Currency({ onRedactChange }) {
  return (
    <Card slideId="currency" title="Currency Narrative & Exchange Table" num="00.026" onRedactChange={onRedactChange}>
      <Guidance>Document currency assumptions, exchange rates, and conversion basis.</Guidance>
      <EditableChunk id="currency:bases" label="Base / Report Currency">
        <FormRow>
          <FormGroup label="Base Currency"><Input name="currency_base" placeholder="USD / EUR / etc." /></FormGroup>
          <FormGroup label="Report Currency"><Input name="currency_report" placeholder="USD / EUR / etc." /></FormGroup>
        </FormRow>
      </EditableChunk>
      <EditableChunk id="currency:narr" label="Currency Narrative">
        <FormGroup label="Currency Narrative">
          <TextArea name="currency_narrative" placeholder="Describe exchange rate assumptions and currency risk management..." />
        </FormGroup>
      </EditableChunk>
      <EditableChunk id="currency:table" label="Exchange table">
        <table className="data-table">
          <thead><tr><th>Currency</th><th>Rate</th><th>Apply To</th></tr></thead>
          <tbody>
            {Array.from({ length: 4 }).map((_, i) => (
              <tr key={i}>
                <td><Input name={`currency_code_${i}`} /></td>
                <td><Input name={`currency_rate_${i}`} /></td>
                <td><Input name={`currency_apply_${i}`} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </EditableChunk>
    </Card>
  );
}
