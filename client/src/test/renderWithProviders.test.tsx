import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { renderWithProviders } from "./renderWithProviders";

function Dummy() {
    return <div>ok</div>;
}

describe("renderWithProviders", () => {
    it("renders with app providers", () => {
        renderWithProviders(<Dummy />);
        expect(screen.getByText("ok")).toBeInTheDocument();
    });
});