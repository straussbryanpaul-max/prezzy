import Card from '../components/Card.jsx';
import Guidance from '../components/Guidance.jsx';
import { FormGroup, Input, TextArea } from '../components/Field.jsx';

const TYPES = ['Design', 'Scope', 'Schedule', 'Cost'];

export default function Contingency({ onRedactChange }) {
  return (
    <Card slideId="contingency" title="Contingency" num="06.002" onRedactChange={onRedactChange}>
      <Guidance>Document the contingency methodology, ranges, and how contingency supports estimate classification and risk.</Guidance>
      <FormGroup label="Contingency Approach">
        <TextArea name="contingency_approach" placeholder="Describe contingency methodology..." rows={5} />
      </FormGroup>
      <table className="data-table">
        <thead><tr><th>Contingency Type</th><th>Value</th><th>Basis</th></tr></thead>
        <tbody>
          {TYPES.map((item, i) => (
            <tr key={i}>
              <td style={{ fontWeight: 600 }}>{item}</td>
              <td><Input name={`cont_val_${i}`} placeholder="$" /></td>
              <td><Input name={`cont_basis_${i}`} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
