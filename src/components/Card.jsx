import RedactCheck from './RedactCheck.jsx';

export default function Card({ slideId, title, num, children, onRedactChange }) {
  return (
    <div className="slide-card" id={`card_${slideId}`}>
      <div className="card-header">
        <div>
          <div className="slide-num">{num}</div>
          <h2>{title}</h2>
        </div>
        <RedactCheck slideId={slideId} onChange={onRedactChange} />
      </div>
      <div className="card-body">{children}</div>
    </div>
  );
}
