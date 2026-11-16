import { useState } from "react";
import { FLIGHT, INITIAL_PASSENGERS, MAX_PASSENGERS } from "./data/flight";
import { SEAT_ROWS } from "./utils/seats";
import SeatMap from "./components/SeatMap";
import PassengerList from "./components/PassengerList";
import BookingSummary from "./components/BookingSummary";
import AddPassengerForm from "./components/AddPassenger";
import BookingConfirmation from "./components/BookingConfirmation";

export default function App() {
  const [passengers, setPassengers] = useState(INITIAL_PASSENGERS);
  const [activePassengerId, setActivePassengerId] = useState(
    INITIAL_PASSENGERS[0].id,
  );
  const [bookedConfirmed, setBookedConfirmed] = useState(false);

  function handleSelectSeat(seatId) {
    const takenBy = passengers.find((passenger) => passenger.seatId === seatId);
    if (takenBy && takenBy.id !== activePassengerId) return;

    setPassengers((prevPassengers) =>
      prevPassengers.map((passenger) =>
        passenger.id === activePassengerId
          ? { ...passenger, seatId }
          : passenger,
      ),
    );
  }

  function handleClearSeat(passengerId) {
    setPassengers((prevPassengers) =>
      prevPassengers.map((passenger) =>
        passenger.id === passengerId
          ? { ...passenger, seatId: null }
          : passenger,
      ),
    );
  }

  function handleAddPassenger(newPassenger) {
    console.log("newPassenger", newPassenger);
    const lastId = passengers[passengers.length - 1].id;
    setPassengers([
      ...passengers,
      {
        id: lastId + 1,
        name: newPassenger,
        seatId: null,
      },
    ]);
  }

  function handleRemovePassenger(passengerId) {
    if (passengers.length <= 1) {
      return;
    }

    const remaining = passengers.filter(
      (passenger) => passenger.id !== passengerId,
    );

    setPassengers(remaining);
    console.log("passengerId", passengerId);
    console.log("activePassengerId", activePassengerId);

    if (passengerId === activePassengerId) {
      setActivePassengerId(remaining[0].id);
    }
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
      {bookedConfirmed ? (
        <BookingConfirmation
          passengers={passengers}
          setBookedConfirmed={(event) => setBookedConfirmed(event)}
        />
      ) : (
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
              onRemovePassenger={handleRemovePassenger}
            />
            <AddPassengerForm
              onAdd={handleAddPassenger}
              canAdd={passengers.length >= MAX_PASSENGERS}
            />
            <BookingSummary
              passengers={passengers}
              bookedConfirmed={(event) => setBookedConfirmed(event)}
            />
          </aside>
        </main>
      )}
    </div>
  );
}
