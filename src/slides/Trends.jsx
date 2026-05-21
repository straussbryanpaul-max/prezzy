import Card from '../components/Card.jsx';
import Guidance from '../components/Guidance.jsx';
import EditableChunk from '../components/EditableChunk.jsx';
import { Input, Select } from '../components/Field.jsx';

export default function Trends({ onRedactChange }) {
  return (
    <Card slideId="trends" title="Trends & Late Changes" num="07.002" onRedactChange={onRedactChange}>
      <Guidance>Summary of late changes captured outside the body of the estimate and any basis changes incurred.</Guidance>
      <EditableChunk id="trends:table" label="Trends table">
        <table className="data-table">
          <thead><tr><th>#</th><th>Change Type</th><th>Title</th><th>Value ($)</th><th>Comments</th></tr></thead>
          <tbody>
            {Array.from({ length: 10 }).map((_, i) => (
              <tr key={i}>
                <td style={{ width: 40, textAlign: 'center' }}>{String(i + 1).padStart(2, '0')}</td>
                <td style={{ width: 130 }}>
                  <Select name={`tr_type_${i}`} options={['Addition', 'Deletion', 'Revision', 'Scope Change']} />
                </td>
                <td><Input name={`tr_title_${i}`} /></td>
                <td style={{ width: 120 }}><Input name={`tr_val_${i}`} placeholder="$" /></td>
                <td><Input name={`tr_comments_${i}`} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </EditableChunk>
    </Card>
  );
}
