 import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import CreateTodoModal from "./CreateTodoModal";
import { renderWithProviders } from "../../test/renderWithProviders";

describe("CreateTodoModal", () => {
    it("opens when isOpen is true", async () => {
        renderWithProviders(
        <CreateTodoModal isOpen={true} onClose={vi.fn()} onSubmit={vi.fn()} />,
        );

        expect(await screen.findByText(/create todo/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    });

    it("valid submit calls onSubmit and closes", async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        const onSubmit = vi.fn().mockResolvedValue(undefined);

        renderWithProviders(
        <CreateTodoModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />,
        );

        await user.type(screen.getByLabelText(/title/i), "New todo");
        await user.type(screen.getByLabelText(/description/i), "desc");
        const priority = screen.getByLabelText(/priority/i);
        await user.clear(priority);
        await user.type(priority, "3");

        await user.click(screen.getByRole("button", { name: /create/i }));

        await waitFor(() =>
        expect(onSubmit).toHaveBeenCalledWith({
            title: "New todo",
            description: "desc",
            priority: 3,
        }),
        );

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("invalid submit blocks and shows title validation text", async () => {
        renderWithProviders(
        <CreateTodoModal isOpen={true} onClose={vi.fn()} onSubmit={vi.fn()} />,
        );

        const createButton = screen.getByRole("button", { name: /create/i });

        expect(createButton).toBeDisabled();
        expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });
});
