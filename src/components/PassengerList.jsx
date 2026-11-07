export default function PassengerList({
  passengers,
  activePassengerId,
  onSelectPassenger,
  onClearSeat,
}) {
  return (
    <section className="panel">
      <h2 className="panel-title">Passengers</h2>
      <p className="panel-hint">Pick a passenger, then pick a seat.</p>
      <ul className="passenger-list">
        {passengers.map((passenger) => (
          <PassengerCard
            key={passenger.id}
            passenger={passenger}
            isActive={passenger.id === activePassengerId}
            onSelect={() => onSelectPassenger(passenger.id)}
            onClearSeat={() => onClearSeat(passenger.id)}
          />
        ))}
      </ul>
    </section>
  );
}

function PassengerCard({ passenger, isActive, onSelect, onClearSeat }) {
  return (
    <li
      data-testid="passenger-card"
      aria-current={isActive ? "true" : undefined}
      className={`passenger-card ${isActive ? "passenger-card-active" : ""}`}
      onClick={onSelect}
    >
      <div className="passenger-info">
        <span className="passenger-name">{passenger.name}</span>
        <span className="passenger-seat">
          {passenger.seatId ? `Seat ${passenger.seatId}` : "No seat"}
        </span>
      </div>
      <div className="passenger-actions">
        {passenger.seatId && (
          <button type="button" className="btn-link" onClick={onClearSeat}>
            Clear seat
          </button>
        )}
        {/* TODO: add the "Remove" button */}
      </div>
    </li>
  );
}
