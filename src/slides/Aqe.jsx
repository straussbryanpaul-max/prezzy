import Card from '../components/Card.jsx';
import Guidance from '../components/Guidance.jsx';
import BrainDump from '../components/BrainDump.jsx';
import EditableChunk from '../components/EditableChunk.jsx';
import { Input, Select } from '../components/Field.jsx';

export default function Aqe({ onRedactChange }) {
  return (
    <Card slideId="aqe" title="Assumptions, Qualifications & Exclusions" num="07.001" onRedactChange={onRedactChange}>
      <Guidance>
        Key Assumptions, qualifications and exclusions. Organize and list by commodity or category.
      </Guidance>
      <EditableChunk id="aqe:table" label="AQE table">
        <table className="data-table">
          <thead><tr><th>#</th><th>Type</th><th>Function</th><th>Discipline</th><th>Description</th></tr></thead>
          <tbody>
            {Array.from({ length: 15 }).map((_, i) => (
              <tr key={i}>
                <td style={{ width: 40, textAlign: 'center' }}>{String(i + 1).padStart(2, '0')}</td>
                <td style={{ width: 130 }}>
                  <Select name={`aqe_type_${i}`} options={['Assumption', 'Qualification', 'Exclusion']} />
                </td>
                <td style={{ width: 130 }}><Input name={`aqe_func_${i}`} /></td>
                <td style={{ width: 130 }}><Input name={`aqe_disc_${i}`} /></td>
                <td><Input name={`aqe_desc_${i}`} placeholder="Description..." /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </EditableChunk>
      <BrainDump slideId="aqe" />
    </Card>
  );
}
