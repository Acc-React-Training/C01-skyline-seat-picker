/* eslint-disable react-refresh/only-export-components */
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Renders a component and returns a ready-to-use userEvent instance.
const customRender = (ui, options) => ({
  user: userEvent.setup(),
  ...render(ui, options),
});

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
