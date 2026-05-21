import Card from '../components/Card.jsx';
import Guidance from '../components/Guidance.jsx';
import BrainDump from '../components/BrainDump.jsx';
import ImageUpload from '../components/ImageUpload.jsx';
import { FormGroup, Select, TextArea } from '../components/Field.jsx';
import { ESTIMATE_CLASSES } from '../data/constants.js';

export default function EstClass({ onRedactChange }) {
  return (
    <Card slideId="est_class" title="Estimate Classification — Graph & Narrative" num="00.004" onRedactChange={onRedactChange}>
      <Guidance>
        Insert brief writeup of the expected classification and how it has been achieved or deviates from the intent. Use the
        Estimate Classification template to explain the basis. Discuss the estimate classification determination basis and how
        specific requirements were maintained for compliance (design input, estimating techniques, procurement quality).
        Highlight significant items that affected accuracy and/or contingency assessment.
      </Guidance>
      <FormGroup label="Estimate Classification"><Select name="class_select" options={ESTIMATE_CLASSES} /></FormGroup>
      <table className="data-table" style={{ marginBottom: 20 }}>
        <thead><tr><th></th><th>Class 5</th><th>Class 4</th><th>Class 3</th><th>Class 2</th><th>Class 1</th></tr></thead>
        <tbody>
          <tr><td style={{ fontWeight: 600 }}>Accuracy (Low)</td><td>-20% to -50%</td><td>-15% to -30%</td><td>-10% to -20%</td><td>-5% to -15%</td><td>-3% to -10%</td></tr>
          <tr><td style={{ fontWeight: 600 }}>Accuracy (High)</td><td>+30% to +100%</td><td>+20% to +50%</td><td>+10% to +30%</td><td>+5% to +20%</td><td>+3% to +15%</td></tr>
          <tr><td style={{ fontWeight: 600 }}>Description</td><td>Indicative/Conceptual</td><td>Feasibility/ROM</td><td>Preliminary</td><td>Engineer's</td><td>Definitive</td></tr>
          <tr><td style={{ fontWeight: 600 }}>Eng. % Complete</td><td>0%–2%</td><td>1%–15%</td><td>10%–40%</td><td>30%–70%</td><td>50%–100%</td></tr>
        </tbody>
      </table>
      <FormGroup label="Classification Narrative">
        <TextArea name="class_narrative" placeholder="Describe classification basis, compliance, and accuracy assessment..." rows={6} />
      </FormGroup>
      <ImageUpload name="class_graph" />
      <BrainDump slideId="est_class" />
    </Card>
  );
}
