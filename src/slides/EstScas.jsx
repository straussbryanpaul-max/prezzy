import Card from '../components/Card.jsx';
import Guidance from '../components/Guidance.jsx';
import BrainDump from '../components/BrainDump.jsx';
import { TextArea } from '../components/Field.jsx';

const ITEMS = ['Package Count', 'Contracting Strategy', 'DH/Subcontract Split', 'Estimate Support Status', 'Open Pricing Items'];

export default function EstScas({ onRedactChange }) {
  return (
    <Card slideId="est_scas" title="SCAS & Contracting Plan" num="03.017" onRedactChange={onRedactChange}>
      <Guidance>Document the SCAS summary, package count, contracting approach, and estimate support status for packages.</Guidance>
      <table className="data-table">
        <thead><tr><th>SCAS Element</th><th>Detail</th></tr></thead>
        <tbody>
          {ITEMS.map((item, i) => (
            <tr key={i}>
              <td style={{ fontWeight: 600 }}>{item}</td>
              <td><TextArea name={`scas_${i}`} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <BrainDump slideId="est_scas" />
    </Card>
  );
}
