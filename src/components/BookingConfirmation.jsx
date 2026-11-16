import { calculateTotal, getSeatPrice } from "../utils/seats";

export default function BookingConfirmation({
  passengers,
  setBookedConfirmed,
}) {
  let total = calculateTotal(passengers);
  return (
    <section className="confirmation">
      <h2 className="confirmation-title">Booking confirmed</h2>
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
        onClick={() => setBookedConfirmed(false)}
      >
        Edit booking
      </button>
    </section>
  );
}
