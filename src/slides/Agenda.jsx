import Card from '../components/Card.jsx';
import Guidance from '../components/Guidance.jsx';
import BrainDump from '../components/BrainDump.jsx';
import EditableChunk from '../components/EditableChunk.jsx';
import { FormGroup, TextArea } from '../components/Field.jsx';

export default function Agenda({ onRedactChange }) {
  return (
    <Card slideId="agenda" title="Review Agenda" num="Agenda" onRedactChange={onRedactChange}>
      <Guidance>
        Typical: services, major cost driver commodities, based on tornado chart of values for Primary Sections.
      </Guidance>
      <EditableChunk id="agenda:primary" label="Primary Sections">
        <FormGroup label="Primary Sections">
          <TextArea name="agenda_primary" placeholder="List primary review topics based on cost drivers..." />
        </FormGroup>
      </EditableChunk>
      <EditableChunk id="agenda:secondary" label="Secondary Sections">
        <FormGroup label="Secondary Sections">
          <TextArea name="agenda_secondary" placeholder="List secondary review topics..." />
        </FormGroup>
      </EditableChunk>
      <BrainDump slideId="agenda" />
    </Card>
  );
}
