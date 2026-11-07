export default function Seat({
  seat,
  occupied,
  passengerInitials,
  isActivePassengerSeat,
  onSelect,
}) {
  const isAssigned = Boolean(passengerInitials);
  const label = `Seat ${seat.id}, ${seat.type}${
    seat.isExitRow ? ", exit row" : ""
  }, $${seat.price}`;

  let stateClass = "seat-available";
  if (occupied) stateClass = "seat-occupied";
  else if (isActivePassengerSeat) stateClass = "seat-active";
  else if (isAssigned) stateClass = "seat-assigned";

  return (
    <button
      type="button"
      className={`seat ${stateClass} ${seat.isExitRow ? "seat-exit" : ""} ${
        seat.column === "C" ? "seat-before-aisle" : ""
      }`}
      aria-label={label}
      aria-pressed={isAssigned}
      disabled={occupied}
      title={label}
      onClick={() => onSelect(seat.id)}
    >
      {occupied ? "×" : passengerInitials ?? seat.column}
    </button>
  );
}
