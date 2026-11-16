import { calculateTotal, getSeatPrice } from "../utils/seats";

export default function BookingSummary({ passengers, bookedConfirmed }) {
  let total = calculateTotal(passengers);
  const everyoneHasSeat = passengers.every((passengers) => passengers.seatId);

  return (
    <section className="panel">
      <h2 className="panel-title">Summary</h2>
      <ul className="summary-list">
        {passengers.map((passenger) => (
          <li key={passenger.id} className="summary-item">
            <span>{passenger.name}</span>
            <span>
              {passenger.seatId
                ? `${passenger.seatId} · $${getSeatPrice(passenger.seatId)}`
                : "—"}
            </span>
          </li>
        ))}
      </ul>
      <p data-testid="booking-total" className="summary-total">
        Total: ${total}
      </p>
      <button
        type="button"
        className="btn-primary"
        disabled={!everyoneHasSeat}
        onClick={() => bookedConfirmed(true)}
      >
        Confirm booking
      </button>
    </section>
  );
}
