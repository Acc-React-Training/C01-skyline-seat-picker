import { useState } from "react";

export default function AddPassengerForm({ onAdd, canAdd }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    setError("");
    onAdd(name);

    setName("");
  }

  return (
    <section className="panel">
      <form className="add-passenger-form" onSubmit={handleSubmit}>
        <label htmlFor="passenger-name" className="panel-hint">
          Passenger name
        </label>
        <div className="add-passenger-row">
          <input
            id="passenger-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <button className="btn-primary" type="submit" disabled={canAdd}>
            Add passenger
          </button>
        </div>
        {error && <p className="form-error">{error}</p>}
      </form>
    </section>
  );
}
