import {
  ROWS,
  COLUMNS,
  EXIT_ROWS,
  SEAT_PRICES,
  EXIT_ROW_EXTRA,
  OCCUPIED_SEATS,
} from "../data/flight";

export function getSeatType(column) {
  if (column === "A" || column === "F") return "window";
  if (column === "C" || column === "D") return "aisle";
  return "middle";
}

function createSeat(row, column) {
  const type = getSeatType(column);
  const isExitRow = EXIT_ROWS.includes(row);
  const id = `${row}${column}`;

  return {
    id,
    row,
    column,
    type,
    isExitRow,
    price: SEAT_PRICES[type] + (isExitRow ? EXIT_ROW_EXTRA : 0),
    occupied: OCCUPIED_SEATS.includes(id),
  };
}

// Returns the seat map as an array of rows: [[1A, 1B, ...], [2A, 2B, ...], ...]
export function buildSeatRows() {
  return Array.from({ length: ROWS }, (_, index) =>
    COLUMNS.map((column) => createSeat(index + 1, column))
  );
}

export const SEAT_ROWS = buildSeatRows();

export function getSeatById(seatId) {
  return SEAT_ROWS.flat().find((seat) => seat.id === seatId);
}

export function getSeatPrice(seatId) {
  return getSeatById(seatId)?.price ?? 0;
}

export function calculateTotal(passengers) {
  return passengers.reduce(
    (total, passenger) =>
      passenger.seatId ? total + getSeatPrice(passenger.seatId) : total,
    0
  );
}

export function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase())
    .slice(0, 2)
    .join("");
}
