export const FLIGHT = {
  number: "SL 482",
  from: "CUN",
  to: "MEX",
  date: "Dec 18, 2026",
  departure: "07:40",
};

export const ROWS = 10;
export const COLUMNS = ["A", "B", "C", "D", "E", "F"];
export const EXIT_ROWS = [6];

export const SEAT_PRICES = {
  window: 45,
  aisle: 35,
  middle: 25,
};
export const EXIT_ROW_EXTRA = 20;

export const OCCUPIED_SEATS = [
  "1A", "1B", "2E", "3D", "4B", "4F",
  "6A", "7C", "7E", "8B", "9F", "10D",
];

export const MAX_PASSENGERS = 4;

export const INITIAL_PASSENGERS = [
  { id: 1, name: "Ana López", seatId: null },
  { id: 2, name: "Luis Pérez", seatId: null },
];
