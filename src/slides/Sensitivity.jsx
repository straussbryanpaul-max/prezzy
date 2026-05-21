import Card from '../components/Card.jsx';
import Guidance from '../components/Guidance.jsx';
import ImageUpload from '../components/ImageUpload.jsx';
import EditableChunk from '../components/EditableChunk.jsx';
import { FormGroup, Input, TextArea } from '../components/Field.jsx';

export default function Sensitivity({ onRedactChange }) {
  return (
    <Card slideId="sensitivity" title="Sensitivity Analysis" num="00.022" onRedactChange={onRedactChange}>
      <Guidance>
        Capture the key variables that most affect the total estimate value. Use a simple table or tornado chart narrative.
      </Guidance>
      <EditableChunk id="sensitivity:table" label="Sensitivity table">
        <table className="data-table">
          <thead><tr><th>Factor</th><th>Impact +/-</th><th>Basis</th></tr></thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, i) => (
              <tr key={i}>
                <td><Input name={`sens_factor_${i}`} /></td>
                <td><Input name={`sens_impact_${i}`} /></td>
                <td><Input name={`sens_basis_${i}`} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </EditableChunk>
      <EditableChunk id="sensitivity:conc" label="Conclusions">
        <FormGroup label="Conclusions"><TextArea name="sens_conclusions" placeholder="Summarize the highest-impact sensitivities..." /></FormGroup>
      </EditableChunk>
      <EditableChunk id="sensitivity:chart" label="Sensitivity chart">
        <ImageUpload name="sensitivity_chart" />
      </EditableChunk>
    </Card>
  );
}
