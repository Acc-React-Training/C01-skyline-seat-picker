import { useState } from "react";
import { calculateTotal, getSeatPrice } from "../utils/seats";

export default function BookingSummary({ passengers }) {
  const [total] = useState(calculateTotal(passengers));

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
      {/* TODO: add the "Confirm booking" button */}
    </section>
  );
}
