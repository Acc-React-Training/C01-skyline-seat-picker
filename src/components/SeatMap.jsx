import { COLUMNS } from "../data/flight";
import { getInitials } from "../utils/seats";
import Seat from "./Seat";

export default function SeatMap({
  seatRows,
  passengers,
  activePassengerId,
  onSelectSeat,
}) {
  function getPassengerInSeat(seatId) {
    return passengers.find((passenger) => passenger.seatId === seatId);
  }

  return (
    <section className="seat-map" aria-label="Seat map">
      <SeatLegend />
      <div className="seat-map-grid">
        <div className="seat-row seat-row-header">
          <span className="seat-row-number" />
          {COLUMNS.map((column) => (
            <span key={column} className="seat-column-label">
              {column}
            </span>
          ))}
        </div>
        {seatRows.map((row) => (
          <div
            key={row[0].row}
            className={`seat-row ${row[0].isExitRow ? "seat-row-exit" : ""}`}
          >
            <span className="seat-row-number">{row[0].row}</span>
            {row.map((seat) => {
              const passenger = getPassengerInSeat(seat.id);
              return (
                <Seat
                  key={seat.id}
                  seat={seat}
                  isOccupied={seat.occupied}
                  passengerInitials={passenger ? getInitials(passenger.name) : null}
                  isActivePassengerSeat={passenger?.id === activePassengerId}
                  onSelect={onSelectSeat}
                />
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}

function SeatLegend() {
  return (
    <ul className="seat-legend">
      <li>
        <span className="seat-legend-swatch seat-available" /> Available
      </li>
      <li>
        <span className="seat-legend-swatch seat-occupied" /> Occupied
      </li>
      <li>
        <span className="seat-legend-swatch seat-assigned" /> Your group
      </li>
      <li>
        <span className="seat-legend-swatch seat-exit" /> Exit row (+$20)
      </li>
    </ul>
  );
}
