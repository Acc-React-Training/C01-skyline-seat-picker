import { useState } from "react";
import { FLIGHT, INITIAL_PASSENGERS } from "./data/flight";
import { SEAT_ROWS } from "./utils/seats";
import SeatMap from "./components/SeatMap";
import PassengerList from "./components/PassengerList";
import BookingSummary from "./components/BookingSummary";

export default function App() {
  const [passengers, setPassengers] = useState(INITIAL_PASSENGERS);
  const [activePassengerId, setActivePassengerId] = useState(
    INITIAL_PASSENGERS[0].id
  );

  function handleSelectSeat(seatId) {
    setPassengers((prevPassengers) =>
      prevPassengers.map((passenger) =>
        passenger.id === activePassengerId ? { ...passenger, seatId } : passenger
      )
    );
  }

  function handleClearSeat(passengerId) {
    setPassengers((prevPassengers) =>
      prevPassengers.map((passenger) =>
        passenger.id === passengerId ? { ...passenger, seatId: null } : passenger
      )
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <p className="app-brand">SkyLine Airlines</p>
          <h1 className="app-title">Choose your seats</h1>
        </div>
        <p className="flight-info">
          {FLIGHT.number} · {FLIGHT.from} → {FLIGHT.to} · {FLIGHT.date} ·{" "}
          {FLIGHT.departure}
        </p>
      </header>

      <main className="booking-layout">
        <SeatMap
          seatRows={SEAT_ROWS}
          passengers={passengers}
          activePassengerId={activePassengerId}
          onSelectSeat={handleSelectSeat}
        />

        <aside className="booking-sidebar">
          <PassengerList
            passengers={passengers}
            activePassengerId={activePassengerId}
            onSelectPassenger={setActivePassengerId}
            onClearSeat={handleClearSeat}
          />
          {/* TODO: add the form to add a new passenger */}
          <BookingSummary passengers={passengers} />
        </aside>
      </main>
    </div>
  );
}
