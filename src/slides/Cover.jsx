import Card from '../components/Card.jsx';
import { FormGroup, FormRow, Input, Select } from '../components/Field.jsx';
import { ESTIMATE_CLASSES, REVIEW_TYPES } from '../data/constants.js';

export default function Cover({ onRedactChange }) {
  return (
    <Card slideId="cover" title="Estimate Basis and Presentation" num="Cover Page" onRedactChange={onRedactChange}>
      <FormRow>
        <FormGroup label="Date"><Input name="cover_date" type="date" /></FormGroup>
        <FormGroup label="Project Name"><Input name="project_name" placeholder="Enter project name" /></FormGroup>
      </FormRow>
      <FormRow>
        <FormGroup label="Client Name"><Input name="client_name" placeholder="Enter client name" /></FormGroup>
        <FormGroup label="Estimate Class"><Select name="est_class" options={ESTIMATE_CLASSES} /></FormGroup>
      </FormRow>
      <FormGroup label="Review Type"><Select name="review_type" options={REVIEW_TYPES} /></FormGroup>
    </Card>
  );
}
