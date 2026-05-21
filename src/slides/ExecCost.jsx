import Card from '../components/Card.jsx';
import Guidance from '../components/Guidance.jsx';
import { FormGroup, Input, TextArea } from '../components/Field.jsx';

const ITEMS = ['Directs', 'Construction Indirects', 'Home Office', 'Field Services', 'Escalation', 'Contingency', 'Fee (excluded)'];

export default function ExecCost({ onRedactChange }) {
  return (
    <Card slideId="exec_cost" title="Executive Cost Summary" num="00.023" onRedactChange={onRedactChange}>
      <Guidance>Executive summary of direct & indirect costs, plus any excluded fee note. Align this with Exhibit 01 content.</Guidance>
      <table className="data-table">
        <thead><tr><th>Category</th><th>Estimate Value</th><th>Notes</th></tr></thead>
        <tbody>
          {ITEMS.map((item, i) => (
            <tr key={i}>
              <td style={{ fontWeight: 600 }}>{item}</td>
              <td><Input name={`exec_val_${i}`} placeholder="$" /></td>
              <td><Input name={`exec_note_${i}`} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <FormGroup label="Executive Commentary"><TextArea name="exec_commentary" placeholder="Summary for leadership review..." /></FormGroup>
    </Card>
  );
}
