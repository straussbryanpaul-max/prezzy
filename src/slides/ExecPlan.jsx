import Card from '../components/Card.jsx';
import Guidance from '../components/Guidance.jsx';
import BrainDump from '../components/BrainDump.jsx';
import { Select, TextArea } from '../components/Field.jsx';
import { CONTRACT_TYPES, CONSTRUCTION_ENTITIES } from '../data/constants.js';

export default function ExecPlan({ onRedactChange }) {
  return (
    <Card slideId="exec_plan" title="Execution Plan Summary" num="02.001" onRedactChange={onRedactChange}>
      <Guidance>
        Execution strategy including engineering, construction, project controls, procurement, contracts and startup scope and
        roles and responsibilities.
      </Guidance>
      <table className="data-table">
        <thead><tr><th style={{ width: 180 }}>Function</th><th>Writeup</th></tr></thead>
        <tbody>
          <tr>
            <td><strong>General</strong><br /><Select name="exec_contract" options={CONTRACT_TYPES} /></td>
            <td><TextArea name="exec_general" placeholder="Lead office, delivery model, JV roles..." /></td>
          </tr>
          <tr>
            <td><strong>Engineering</strong></td>
            <td><TextArea name="exec_eng" placeholder="Engineering office, approach..." /></td>
          </tr>
          <tr>
            <td><strong>Procurement</strong></td>
            <td><TextArea name="exec_proc" placeholder="MPAGs, Global Supply Network, local procurement..." /></td>
          </tr>
          <tr>
            <td><strong>Construction</strong><br /><Select name="exec_const_entity" options={CONSTRUCTION_ENTITIES} /></td>
            <td><TextArea name="exec_const" placeholder="Direct hire/subcontract, work week, shift schedule..." /></td>
          </tr>
          <tr>
            <td><strong>Startup</strong></td>
            <td><TextArea name="exec_startup" placeholder="Startup support, local hires, shared personnel..." /></td>
          </tr>
          <tr>
            <td><strong>Management</strong></td>
            <td><TextArea name="exec_mgmt" placeholder="PM duration, business management, schedule transfer..." /></td>
          </tr>
        </tbody>
      </table>
      <BrainDump slideId="exec_plan" />
    </Card>
  );
}
