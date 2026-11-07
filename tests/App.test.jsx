import { render, screen, within } from "../test-utils/custom-render.jsx";
import { expect, describe, it, beforeEach, vi } from "vitest";

// Each test loads a fresh copy of App and its data,
// so a solution that mutates shared data cannot affect other tests.
let App;
beforeEach(async () => {
  vi.resetModules();
  App = (await import("../src/App.jsx")).default;
});

// ---------- Helpers ----------

const ANA = "Ana López";
const LUIS = "Luis Pérez";

const cards = () => screen.queryAllByTestId("passenger-card");

const cardOf = (name) =>
  cards().find((card) => within(card).queryByText(name));

const seatTextOf = (name) => within(cardOf(name)).getByText(/^(seat \w+|no seat)$/i);

const isActive = (name) => cardOf(name).getAttribute("aria-current") === "true";

const seatButton = (seatId) =>
  screen.getByRole("button", { name: new RegExp(`^Seat ${seatId},`) });

const allSeatButtons = () =>
  screen.queryAllByRole("button", { name: /^Seat \d+[A-F],/ });

const totalText = () => screen.getByTestId("booking-total");

const expectTotal = (amount) =>
  expect(totalText()).toHaveTextContent(new RegExp(`\\$\\s*${amount}(?!\\d)`));

async function activate(user, name) {
  await user.click(within(cardOf(name)).getByText(name));
}

async function pickSeat(user, name, seatId) {
  await activate(user, name);
  await user.click(seatButton(seatId));
}

const removeButtonOf = (name) =>
  within(cardOf(name)).queryByRole("button", { name: /remove/i });

const nameInput = () => screen.queryByLabelText(/passenger name/i);
const addButton = () => screen.queryByRole("button", { name: /add passenger/i });

async function addPassenger(user, name) {
  const input = nameInput();
  const button = addButton();
  if (!input || !button || input.disabled || button.disabled) return;
  await user.clear(input);
  if (name) await user.type(input, name);
  await user.click(button);
}

const confirmButton = () =>
  screen.queryByRole("button", { name: /confirm booking/i });

// ---------- Part 1: bug fixes ----------

describe("Part 1: bug fixes", () => {
  it("Occupied seats cannot be selected", async () => {
    const { user } = render(<App />);

    await user.click(seatButton("1A"));
    await user.click(seatButton("4B"));

    expect(seatTextOf(ANA)).toHaveTextContent(/^no seat$/i);
    expectTotal(0);
  });

  it("The total price updates when seats are assigned", async () => {
    const { user } = render(<App />);
    expectTotal(0);

    await pickSeat(user, ANA, "3A");
    expectTotal(45);

    await pickSeat(user, LUIS, "6F");
    expectTotal(110);

    await pickSeat(user, LUIS, "5B");
    expectTotal(70);
  });

  it("Clicking Clear seat does not change the active passenger", async () => {
    const { user } = render(<App />);

    await pickSeat(user, ANA, "3A");
    await pickSeat(user, LUIS, "3C");
    await activate(user, ANA);

    await user.click(within(cardOf(LUIS)).getByRole("button", { name: /clear seat/i }));

    expect(seatTextOf(LUIS)).toHaveTextContent(/^no seat$/i);
    expect(isActive(ANA)).toBe(true);
    expect(isActive(LUIS)).toBe(false);
  });
});

// ---------- Part 2: seats ----------

describe("Part 2: seats", () => {
  it("A seat assigned to another passenger cannot be taken", async () => {
    const { user } = render(<App />);

    await pickSeat(user, ANA, "3A");
    await pickSeat(user, LUIS, "3A");

    expect(seatTextOf(ANA)).toHaveTextContent(/^seat 3A$/i);
    expect(seatTextOf(LUIS)).toHaveTextContent(/^no seat$/i);

    // When Ana moves to another seat, 3A becomes free for Luis
    await pickSeat(user, ANA, "5F");
    await pickSeat(user, LUIS, "3A");

    expect(seatTextOf(ANA)).toHaveTextContent(/^seat 5F$/i);
    expect(seatTextOf(LUIS)).toHaveTextContent(/^seat 3A$/i);
    expectTotal(90);
  });

  it("Clearing a seat frees it and updates the total", async () => {
    const { user } = render(<App />);

    await pickSeat(user, ANA, "2C");
    expectTotal(35);

    await user.click(within(cardOf(ANA)).getByRole("button", { name: /clear seat/i }));
    expectTotal(0);

    await pickSeat(user, LUIS, "2C");
    expect(seatTextOf(LUIS)).toHaveTextContent(/^seat 2C$/i);
    expectTotal(35);
  });
});

// ---------- Part 3: passengers ----------

describe("Part 3: passengers", () => {
  it("A passenger can be added with the form", async () => {
    const { user } = render(<App />);

    await addPassenger(user, "Carla Ruiz");

    expect(cards()).toHaveLength(3);
    expect(cardOf("Carla Ruiz")).toBeDefined();
    expect(seatTextOf("Carla Ruiz")).toHaveTextContent(/^no seat$/i);
    expect(nameInput()).toHaveValue("");
  });

  it("An empty name shows an error and no passenger is added", async () => {
    const { user } = render(<App />);

    await addPassenger(user, "");
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();

    await addPassenger(user, "   ");
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();

    expect(cards()).toHaveLength(2);
  });

  it("No more than 4 passengers can be added", async () => {
    const { user } = render(<App />);

    await addPassenger(user, "Carla Ruiz");
    await addPassenger(user, "Diego Sosa");
    expect(cards()).toHaveLength(4);

    await addPassenger(user, "Elena Mora");
    expect(cards()).toHaveLength(4);
    expect(screen.queryByText("Elena Mora")).not.toBeInTheDocument();
  });

  it("Removing a passenger frees their seat", async () => {
    const { user } = render(<App />);

    await pickSeat(user, LUIS, "3A");
    await user.click(removeButtonOf(LUIS));

    expect(cardOf(LUIS)).toBeUndefined();
    expectTotal(0);

    await pickSeat(user, ANA, "3A");
    expect(seatTextOf(ANA)).toHaveTextContent(/^seat 3A$/i);
  });

  it("Removing the active passenger makes the first passenger active", async () => {
    const { user } = render(<App />);

    await addPassenger(user, "Carla Ruiz");
    await activate(user, LUIS);
    await user.click(removeButtonOf(LUIS));

    expect(cards()).toHaveLength(2);
    expect(isActive(ANA)).toBe(true);
  });

  it("The last passenger cannot be removed", async () => {
    const { user } = render(<App />);

    await user.click(removeButtonOf(LUIS));
    expect(cards()).toHaveLength(1);

    const button = removeButtonOf(ANA);
    if (button && !button.disabled) {
      await user.click(button);
    }

    expect(cards()).toHaveLength(1);
    expect(cardOf(ANA)).toBeDefined();
  });
});

// ---------- Part 4: confirmation ----------

describe("Part 4: confirmation", () => {
  it("Confirm booking is enabled only when every passenger has a seat", async () => {
    const { user } = render(<App />);
    expect(confirmButton()).toBeDisabled();

    await pickSeat(user, ANA, "3A");
    expect(confirmButton()).toBeDisabled();

    await pickSeat(user, LUIS, "3C");
    expect(confirmButton()).toBeEnabled();

    await addPassenger(user, "Carla Ruiz");
    expect(confirmButton()).toBeDisabled();
  });

  it("Confirming shows a summary of the booking", async () => {
    const { user } = render(<App />);

    await pickSeat(user, ANA, "3A");
    await pickSeat(user, LUIS, "3C");
    await user.click(confirmButton());

    expect(
      screen.getByRole("heading", { name: /booking confirmed/i })
    ).toBeInTheDocument();
    expect(allSeatButtons()).toHaveLength(0);

    const page = document.body.textContent;
    expect(page).toContain(ANA);
    expect(page).toContain(LUIS);
    expect(page).toMatch(/3A/);
    expect(page).toMatch(/3C/);
    expect(page).toMatch(/\$\s*80(?!\d)/);
  });

  it("Edit booking returns to the seat map with the selections kept", async () => {
    const { user } = render(<App />);

    await pickSeat(user, ANA, "3A");
    await pickSeat(user, LUIS, "3C");
    await user.click(confirmButton());
    await user.click(screen.getByRole("button", { name: /edit booking/i }));

    expect(allSeatButtons()).toHaveLength(60);
    expect(seatTextOf(ANA)).toHaveTextContent(/^seat 3A$/i);
    expect(seatTextOf(LUIS)).toHaveTextContent(/^seat 3C$/i);
    expectTotal(80);
  });
});
