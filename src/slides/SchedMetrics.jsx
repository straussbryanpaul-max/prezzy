import Card from '../components/Card.jsx';
import Guidance from '../components/Guidance.jsx';
import BrainDump from '../components/BrainDump.jsx';
import EditableChunk from '../components/EditableChunk.jsx';
import { Input } from '../components/Field.jsx';

const METRICS = ['Total Duration', 'Critical Path Duration', 'Float', 'Productivity Benchmark', 'Percent Complete'];

export default function SchedMetrics({ onRedactChange }) {
  return (
    <Card slideId="sched_metrics" title="Schedule Metrics" num="02.026" onRedactChange={onRedactChange}>
      <Guidance>Capture key schedule metrics such as duration, float, productivity benchmarks, and schedule risk measures.</Guidance>
      <EditableChunk id="sched_metrics:table" label="Schedule metrics table">
        <table className="data-table">
          <thead><tr><th>Metric</th><th>Value</th><th>Benchmark / Notes</th></tr></thead>
          <tbody>
            {METRICS.map((item, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{item}</td>
                <td><Input name={`sched_metric_${i}`} /></td>
                <td><Input name={`sched_metric_note_${i}`} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </EditableChunk>
      <BrainDump slideId="sched_metrics" />
    </Card>
  );
}
