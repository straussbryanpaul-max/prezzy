import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { DISCIPLINES } from '../data/constants.js';
import DisciplineSlide from './DisciplineSlide.jsx';

export default function DisciplinesIndex({ onRedactChange }) {
  const [activeId, setActiveId] = useLocalStorage('active_discipline', 'civil');
  const active = DISCIPLINES.find(d => d.id === activeId) || DISCIPLINES[0];

  return (
    <>
      <div className="section-divider">
        <h1>03.000 Estimate Basis — By Discipline</h1>
        <div className="sub">Select a discipline to view and edit</div>
      </div>
      <div className="discipline-tabs">
        {DISCIPLINES.map(d => (
          <button
            key={d.id}
            className={d.id === activeId ? 'active' : ''}
            onClick={() => setActiveId(d.id)}
          >
            {d.name}
          </button>
        ))}
      </div>
      <DisciplineSlide discipline={active} onRedactChange={onRedactChange} />
    </>
  );
}
