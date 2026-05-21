import Card from '../components/Card.jsx';
import Guidance from '../components/Guidance.jsx';
import BrainDump from '../components/BrainDump.jsx';
import EditableChunk from '../components/EditableChunk.jsx';
import { Input, TextArea } from '../components/Field.jsx';

const CATEGORIES = ['Project Overhead', 'Construction Indirects', 'Field Overheads', 'Support Services'];

export default function Indirects({ onRedactChange }) {
  return (
    <Card slideId="indirects" title="Indirects Basis of Estimate" num="05.021" onRedactChange={onRedactChange}>
      <Guidance>Explain the indirect cost basis and methodology used to derive construction indirects and field/project overheads.</Guidance>
      <EditableChunk id="indirects:table" label="Indirects table">
        <table className="data-table">
          <thead><tr><th>Indirect Category</th><th>Basis</th><th>Notes</th></tr></thead>
          <tbody>
            {CATEGORIES.map((item, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{item}</td>
                <td><TextArea name={`indirect_basis_${i}`} /></td>
                <td><Input name={`indirect_note_${i}`} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </EditableChunk>
      <BrainDump slideId="indirects" />
    </Card>
  );
}
