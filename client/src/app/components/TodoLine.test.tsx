import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import TodoLine from "./TodoLine";
import type { Todo } from "../api/todoApiModels";
import { renderWithProviders } from "../../test/renderWithProviders";

// mock thunk creators so we can assert dispatch payloads deterministically
vi.mock("../todoSlice", async () => {
const actual = await vi.importActual<typeof import("../todoSlice")>("../todoSlice");

    return {
        ...actual,
        toggleIsDoneThunk: vi.fn((payload: { id: string; payload: { isDone: boolean } }) => ({
        type: "todos/toggleIsDone",
        payload,
        })),
        deleteTodoThunk: vi.fn((id: string) => ({
        type: "todos/deleteTodo",
        payload: id,
        })),
    };
});

import { toggleIsDoneThunk, deleteTodoThunk } from "../todoSlice";

const todoItem: Todo = {
    id: "todo-1",
    title: "Todo title",
    description: "Todo description",
    isDone: false,
    priority: 3,
    dateCreated: "2026-01-01",
};

describe("TodoLine", () => {
    it("toggle checkbox dispatches toggle action for target todo", async () => {
        const user = userEvent.setup();

        renderWithProviders(
        <TodoLine todoItem={todoItem} updateTodoModalOpener={vi.fn()} />,
        );

        await user.click(screen.getByRole("checkbox"));

        expect(toggleIsDoneThunk).toHaveBeenCalledWith({
        id: "todo-1",
        payload: { isDone: true },
        });
    });

    it("trash button dispatches delete action for target todo", async () => {
        const user = userEvent.setup();

        renderWithProviders(
        <TodoLine todoItem={todoItem} updateTodoModalOpener={vi.fn()} />,
        );

        // open detail row so Trash button is visible
        await user.click(screen.getByText("Todo title"));
        await user.click(screen.getByRole("button", { name: /trash/i }));

        expect(deleteTodoThunk).toHaveBeenCalledWith("todo-1");
    });
});
