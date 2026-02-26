import type { ReactElement } from "react";
import { renderWithProviders } from "./renderWithProviders";
import { Toaster } from "../components/ui/toaster";

export function renderWithToasterProviders(ui: ReactElement) {
  return renderWithProviders(
    <>
      {ui}
      <Toaster />
    </>,
  );
}
