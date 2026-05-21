import Card from '../components/Card.jsx';
import Guidance from '../components/Guidance.jsx';
import BrainDump from '../components/BrainDump.jsx';
import EditableChunk from '../components/EditableChunk.jsx';
import { FormGroup, FormRow, Input, Select } from '../components/Field.jsx';
import {
  ESTIMATE_CLASSES,
  BECHTEL_ENTITIES,
  PERFORMING_OFFICES,
  WORK_WEEKS,
  LABOR_TYPES,
} from '../data/constants.js';

export default function ProjectData({ onRedactChange }) {
  return (
    <Card
      slideId="proj_data"
      title="Project & Estimate Overview — Project Data"
      num="00.001"
      onRedactChange={onRedactChange}
    >
      <Guidance>
        This section includes detailed scope description of the facilities, site information, and facility units.
      </Guidance>

      <EditableChunk id="proj_data:project_info" label="Project Information">
        <h3 style={{ color: 'var(--navy)', marginBottom: 16, fontSize: 15 }}>Project Information</h3>
        <FormRow>
          <FormGroup label="Project Name"><Input name="project_name" placeholder="Project name" /></FormGroup>
          <FormGroup label="Estimate Scope"><Input name="est_scope" placeholder="Brief scope description" /></FormGroup>
        </FormRow>
        <FormRow>
          <FormGroup label="Estimate Classification"><Select name="pd_class" options={ESTIMATE_CLASSES} /></FormGroup>
          <FormGroup label="Client"><Input name="client_name" placeholder="Client name" /></FormGroup>
        </FormRow>
        <FormRow>
          <FormGroup label="Technology"><Input name="technology" placeholder="e.g., Air-cooled Data Center, Semiconductor Fab" /></FormGroup>
          <FormGroup label="Location"><Input name="location" placeholder="City, State/Country" /></FormGroup>
        </FormRow>
        <FormRow>
          <FormGroup label="Engineering 3rd Party Support"><Input name="eng_3rd" /></FormGroup>
          <FormGroup label="Project Start Date"><Input name="proj_start" type="date" /></FormGroup>
        </FormRow>
      </EditableChunk>

      <EditableChunk id="proj_data:milestones" label="Key Milestones table">
        <h3 style={{ color: 'var(--navy)', margin: '20px 0 12px', fontSize: 15 }}>Key Milestones</h3>
        <table className="data-table">
          <thead>
            <tr><th>Milestone</th><th>Description</th><th>Date</th></tr>
          </thead>
          <tbody>
            {[1, 2, 3].map(i => (
              <tr key={i}>
                <td><Input name={`ms${i}_name`} placeholder={`Phase ${i} Complete`} /></td>
                <td><Input name={`ms${i}_desc`} /></td>
                <td><Input name={`ms${i}_date`} type="date" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </EditableChunk>

      <EditableChunk id="proj_data:bechtel" label="Bechtel Information">
        <h3 style={{ color: 'var(--navy)', margin: '20px 0 12px', fontSize: 15 }}>Bechtel Information</h3>
        <FormRow>
          <FormGroup label="Bechtel Entity"><Select name="bech_entity" options={BECHTEL_ENTITIES} /></FormGroup>
          <FormGroup label="Performing Office(s)"><Select name="perf_office" options={PERFORMING_OFFICES} /></FormGroup>
        </FormRow>
        <FormRow>
          <FormGroup label="Joint Venture Partners / Other GBUs"><Input name="jv_partners" /></FormGroup>
          <FormGroup label="Estimate DOR"><Input name="est_dor" /></FormGroup>
        </FormRow>
        <FormRow>
          <FormGroup label="Owner's Scope"><Input name="owner_scope" /></FormGroup>
          <FormGroup label="Critical 3rd Party Subs"><Input name="crit_subs" /></FormGroup>
        </FormRow>
        <FormRow>
          <FormGroup label="Reference Project"><Input name="ref_project" /></FormGroup>
          <FormGroup label="Purpose of Estimate"><Input name="est_purpose" /></FormGroup>
        </FormRow>
        <FormRow>
          <FormGroup label="Standard Work Week"><Select name="work_week" options={WORK_WEEKS} /></FormGroup>
          <FormGroup label="Union / Open Shop"><Select name="labor_type" options={LABOR_TYPES} /></FormGroup>
        </FormRow>
      </EditableChunk>

      <BrainDump slideId="proj_data" />
    </Card>
  );
}
