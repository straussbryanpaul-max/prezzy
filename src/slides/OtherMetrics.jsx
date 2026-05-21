import Card from '../components/Card.jsx';
import Guidance from '../components/Guidance.jsx';
import BrainDump from '../components/BrainDump.jsx';
import EditableChunk from '../components/EditableChunk.jsx';
import { Input } from '../components/Field.jsx';

const METRICS = ['$/Unit', '$/Ton', '$/Installation Hour', 'Productivity Index'];

export default function OtherMetrics({ onRedactChange }) {
  return (
    <Card slideId="other_metrics" title="Other Costs Metrics" num="06.006" onRedactChange={onRedactChange}>
      <Guidance>Include additional cost metrics such as $/unit, $/ton, productivity measures, or comparative indices.</Guidance>
      <EditableChunk id="other_metrics:table" label="Metrics table">
        <table className="data-table">
          <thead><tr><th>Metric</th><th>Value</th><th>Benchmark</th></tr></thead>
          <tbody>
            {METRICS.map((item, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{item}</td>
                <td><Input name={`other_metric_${i}`} /></td>
                <td><Input name={`other_bench_${i}`} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </EditableChunk>
      <BrainDump slideId="other_metrics" />
    </Card>
  );
}
