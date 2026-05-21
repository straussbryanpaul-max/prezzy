import Card from '../components/Card.jsx';
import Guidance from '../components/Guidance.jsx';
import { FormGroup, Input, TextArea } from '../components/Field.jsx';

const CATEGORIES = ['Engineering', 'Procurement', 'Construction', 'Indirects', 'Contingency'];

export default function EstGeneral({ onRedactChange }) {
  return (
    <Card slideId="est_general" title="General Quantification & Pricing" num="03.010" onRedactChange={onRedactChange}>
      <Guidance>Summarize general estimate quantification and pricing basis across the project.</Guidance>
      <FormGroup label="General Basis Narrative">
        <TextArea name="estgen_narrative" placeholder="Summarize the general quantification and pricing basis..." rows={6} />
      </FormGroup>
      <table className="data-table">
        <thead><tr><th>Category</th><th>Basis</th><th>Key Qualification</th></tr></thead>
        <tbody>
          {CATEGORIES.map((item, i) => (
            <tr key={i}>
              <td style={{ fontWeight: 600 }}>{item}</td>
              <td><TextArea name={`estgen_basis_${i}`} /></td>
              <td><Input name={`estgen_qual_${i}`} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
