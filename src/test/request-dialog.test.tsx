import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { RequestDialog } from "@/components/RequestDialog";

afterEach(cleanup);

it("opens with the chosen product and lets the visitor change model", () => {
  render(<RequestDialog model="Hard" />);
  fireEvent.click(screen.getByRole("button", { name: /submit a request/i }));
  expect(screen.getByRole("dialog")).toBeVisible();
  expect(screen.getByRole("radio", { name: "Hard" })).toBeChecked();
  fireEvent.click(screen.getByRole("radio", { name: "Soft" }));
  expect(screen.getByRole("radio", { name: "Soft" })).toBeChecked();
  fireEvent.click(screen.getByRole("button", { name: "Close" }));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});
