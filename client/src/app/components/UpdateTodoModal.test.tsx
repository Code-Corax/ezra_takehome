import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import UpdateTodoModal from "./UpdateTodoModal";
import { renderWithProviders } from "../../test/renderWithProviders";
import type { Todo } from "../api/todoApiModels";

const baseTodo: Todo = {
    id: "todo-1",
    title: "Existing title",
    description: "Existing description",
    isDone: false,
    priority: 2,
    dateCreated: "2026-01-01",
};

describe("UpdateTodoModal", () => {
    it("prefills fields from updatingTodo", async () => {
        renderWithProviders(
        <UpdateTodoModal
            isOpen={true}
            onClose={vi.fn()}
            onSubmit={vi.fn()}
            updatingTodo={baseTodo}
        />,
        );

        expect(await screen.findByText(/edit todo/i)).toBeInTheDocument();
        expect(screen.getByDisplayValue("Existing title")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Existing description")).toBeInTheDocument();
        expect(screen.getByDisplayValue("2")).toBeInTheDocument();
        expect(screen.getByRole("checkbox", { name: /status/i })).not.toBeChecked();
    });

    it("toggling Is Done updates submit payload", async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn().mockResolvedValue(undefined);

        renderWithProviders(
        <UpdateTodoModal
            isOpen={true}
            onClose={vi.fn()}
            onSubmit={onSubmit}
            updatingTodo={baseTodo}
        />,
        );

        await user.click(screen.getByRole("checkbox", { name: /status/i }));
        await user.click(screen.getByRole("button", { name: /save/i }));

        await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
            "todo-1",
            expect.objectContaining({ isDone: true }),
        );
        });
    });

    it("save submits expected shape", async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        const onSubmit = vi.fn().mockResolvedValue(undefined);

        renderWithProviders(
        <UpdateTodoModal
            isOpen={true}
            onClose={onClose}
            onSubmit={onSubmit}
            updatingTodo={baseTodo}
        />,
        );

        const title = screen.getByDisplayValue("Existing title");
        const description = screen.getByDisplayValue("Existing description");
        const priority = screen.getByDisplayValue("2");

        await user.clear(title);
        await user.type(title, "Updated title");

        await user.clear(description);
        await user.type(description, "Updated description");

        await user.clear(priority);
        await user.type(priority, "4");

        await user.click(screen.getByRole("checkbox", { name: /status/i }));
        await user.click(screen.getByRole("button", { name: /save/i }));

        await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith("todo-1", {
            title: "Updated title",
            description: "Updated description",
            priority: 4,
            isDone: true,
        });
        });

        expect(onClose).toHaveBeenCalledTimes(1);
    });
});
